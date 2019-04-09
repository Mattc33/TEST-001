import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import {
  IReportViewerState,
  IReportViewer,
  REPORT_VIEWER_PATH
} from "../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react';
import { 
  ReportViewerService, 
  IReportViewerService, 
  UserProfileService, 
  IUserProfileService, 
  ReportActionsService, 
  FavoriteType, 
  withErrHandler } from "../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../base";
import { 
  IErrorResult, 
  IReportItem, 
  IUserProfile, 
  IReportDiscussion,
  IReportDiscussionReply 
} from "../../../models";

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
    
    let [report, rvErr] = await withErrHandler<IReportItem>(this.reportViewerApi.loadReportDefinition(parseInt(reportId)));
    if (rvErr) {
      this.dispatchError(`Report doesn't exists or you don't have permission to view this report: ${reportId}`, rvErr, { loading: false });
      return;
    }

    const { SVPReportHeight, SVPReportWidth, SVPVisualizationTechnology } = report;
    const reportHeight = SVPReportHeight || 600;
    const reportWidth = SVPReportWidth || 800;

    //expect null 'userProfile'
    const [userProfile, upErr] = await withErrHandler<IUserProfile>(this.userProfileApi.loadCurrentUserProfile());

    // if (SVPVisualizationTechnology === "Office") {
    //   [report, rvErr] = await withErrHandler<IReportItem>(this.reportViewerApi.loadReportDefinitionByUrl(report.SVPVisualizationAddress, report));
    //   if (rvErr) {
    //     this.dispatchError(`Report doesn't exists or you don't have permission to view this report: ${reportId}`, rvErr, { loading: false });
    //     return;
    //   }
    // }

    this.dispatch({ 
      loading: false, 
      report, 
      userProfile, 
      reportHeight, 
      reportWidth 
    });
  }
  
  @autobind
  public async loadReportDiscussion(reportId: number, reportTitle: string) {
    this.dispatch({ loadingDiscussion: true, error: null });

    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];

    let discussion: IReportDiscussion = undefined;
    let replies: Array<IReportDiscussionReply> = undefined;

    if (state.discussionInitialized) {
      //get from Cache
      discussion = { ...state.discussion };
      replies = [ ...state.replies ];
      console.info('loadReportDiscussion > loading from state', discussion, replies);
    }
    else {
      //load from SharePoint
      discussion = { title: reportTitle };
      replies = [ { title: `${reportTitle} reply 1` }, { title: `${reportTitle} reply 2` }, { title: `${reportTitle} reply 3` } ];
      console.info('loadReportDiscussion > loading from SharePoint', discussion, replies);
    }

    this.dispatch({ 
      loadingDiscussion: false,
      discussion,
      replies,
      discussionInitialized: true 
    });
  }

  @autobind
  public async addReportDiscussionReply(message: string) {
    this.dispatch({ busyDiscussionUpdates: true, error: null });

    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    const replies: Array<IReportDiscussionReply> = [...state.replies ];

    const reply: IReportDiscussionReply = { title: message };
    replies.push(reply);

    this.dispatch({ 
      busyDiscussionUpdates: false,
      replies
    });
  }

  @autobind
  public async updateReportDiscussionReply(id: number, message: string) {
    this.dispatch({ busyDiscussionUpdates: true, error: null });

    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    const replies: Array<IReportDiscussionReply> = [...state.replies ];

    const reply: IReportDiscussionReply = { title: message };
    replies[id] = reply;

    this.dispatch({ 
      busyDiscussionUpdates: false,
      replies
    });
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
  public resizeComponent(height: number, width: number) {
    this.dispatch({ reportHeight: height, reportWidth: width });
  }

  @autobind
  private dispatchError(msg: string, err: any, status: any) {
    console.error(msg, err);

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
