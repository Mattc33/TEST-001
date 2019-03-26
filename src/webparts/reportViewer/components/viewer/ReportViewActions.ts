import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import {
  IReportViewerState,
  IErrorResult,
  REPORT_VIEWER_PATH
} from "../../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react';
import { ReportViewerService, IReportViewerService, UserProfileService, IUserProfileService, ReportActionsService, FavoriteType } from "../../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../../base";
import { withErrHandler } from "../../../../utils/withErrorHandler";
import { IReportItem, IUserProfile, IUserItem } from "../../../../models";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private context: WebPartContext;
  private reportViewerApi: IReportViewerService;
  private userProfileApi: IUserProfileService;
  private favoriteApi: ReportActionsService;

  constructor(store: IBaseStore, context: WebPartContext) {
    super(store);

    this.context = context;
    this.reportViewerApi = new ReportViewerService();
    this.userProfileApi = new UserProfileService();
    this.favoriteApi = new ReportActionsService();
  }

  @autobind
  public async loadReportData(reportId: any) {
    this.dispatch({ loading: true, error: null });

    if (!reportId || isNaN(reportId)) {
      this.dispatchError(`Invalid or missing reportId parameter: ${reportId}`, {}, { loading: false });
      return;
    }
    
    const [report, rvErr] = await withErrHandler<IReportItem>(this.reportViewerApi.loadReportDefinition(parseInt(reportId)));
    if (rvErr) {
      this.dispatchError(`Report doesn't exists or you don't have permission to view this report: ${reportId}`, rvErr, { loading: false });
      return;
    }

    //expect null 'userProfile'
    const [userProfile, upErr] = await withErrHandler<IUserProfile>(this.userProfileApi.loadCurrentUserProfile());

    report.SVPHeight = report.SVPHeight || 704;
    report.SVPWidth = report.SVPWidth || 799;

    this.dispatch({ loading: false, report, userProfile });
  }

  @autobind
  public async saveReportAsFavorite(reportId: number, name: string, description: string, viewUrl: string) {
    this.dispatch({ savingAsFavorite: true, error: null });

    const reportMetadata: any = { 
      "ViewUrl": viewUrl, 
      "ImageUrl": "" 
    };

    const [success, err] = await withErrHandler<Boolean>(this.favoriteApi.FavoriteReport(
      this.context.pageContext.web.absoluteUrl, 
      reportId, 
      description, 
      FavoriteType.CUSTOM, 
      undefined, 
      JSON.stringify(reportMetadata),
      name
    ));

    if (err || !success) {
      this.dispatchError(`Unable to favorite report: ${reportId}`, err, { savingAsFavorite: false});
      return;
    }

    window.setTimeout(() => {
      this.dispatch({ savingAsFavorite: false, error: null });
    }, 3000);
  }

  @autobind
  private dispatchError(msg: string, err: any, status: any) {
    const error: IErrorResult = {
      errorMessage: msg,
      error: err
    };

    this.dispatch({ ...status, error });
  }

  @autobind
  private async dispatch(incoming: any) {
    await this.dispatcher({
      [REPORT_VIEWER_PATH]: {
        ...this.getState()[REPORT_VIEWER_PATH],
        ...incoming
      }
    });
  }

  // private async dispatchByPath(path: string, incoming: any) {
  //   await this.dispatcherByPath(path, incoming);
  // }
}
