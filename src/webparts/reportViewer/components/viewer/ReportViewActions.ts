import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import {
  IReportViewerState,
  IErrorResult,
  REPORT_VIEWER_PATH
} from "../../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react';
import { ReportViewerService, IReportViewerService, ReportActionsService, FavoriteType } from "../../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../../base";
import { withErrHandler } from "../../../../utils/withErrorHandler";
import { IReportItem } from "../../../../models";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private context: WebPartContext;
  private reportViewerApi: IReportViewerService;
  private favoriteApi: ReportActionsService;

  constructor(store: IBaseStore, context: WebPartContext) {
    super(store);

    this.context = context;
    this.reportViewerApi = new ReportViewerService();
    this.favoriteApi = new ReportActionsService();
  }

  @autobind
  public async loadReportData(reportId: any) {
    this.dispatch({ loading: true, error: null });

    if (!reportId || isNaN(reportId)) {
      const error: IErrorResult = {
        errorMessage: `Invalid or missing reportId parameter: ${reportId}`
      };

      this.dispatch({ loading: false, error });
      return;
    }
    
    const [item, err] = await withErrHandler<IReportItem>(this.reportViewerApi.loadReportDefinition(parseInt(reportId)));
    if (err) {
      const error: IErrorResult = {
        errorMessage: `Report doesn't exists or you don't have permission to view this report: ${reportId}`,
        error: err
      };

      this.dispatch({ loading: false, error });
      return;
    }

    item.SVPHeight = item.SVPHeight || 704;
    item.SVPWidth = item.SVPWidth || 799;

    this.dispatch({ loading: false, report: item });
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
