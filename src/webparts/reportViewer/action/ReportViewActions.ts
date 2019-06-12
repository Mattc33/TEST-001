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
  TableauReport 
} from "../../controls";
import { 
  ReportViewerService, 
  IReportViewerService, 
  UserProfileService, 
  IUserProfileService, 
  ReportActionsService, 
  ReportDiscussionService,
  FavoriteType, 
  withErrHandler, 
  IFavoriteState
} from "../../../services";

//import {} from "../../../services/AnalyticsServices"

import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../base";
import { 
  IErrorResult, 
  IReportItem, 
  IUserProfile, 
  IReportDiscussion,
  IReportDiscussionReply, 
  IFavoriteReport,
  IReportAnalytics,
  ISentimentReply
} from "../../../models";
import * as moment from 'moment';
import { imageProperties } from '@uifabric/utilities';
import { SentimentService } from '../../../services/AnalyticsServices/SentimentService';
import { ISentimentService } from '../../../services/interfaces/ISentimentService';

import {HttpClient} from "@microsoft/sp-http";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private context: WebPartContext;
  private reportViewerApi: IReportViewerService;
  private userProfileApi: IUserProfileService;
  private favoriteApi: ReportActionsService;
  private discussionApi:ReportDiscussionService;
  private sentimentApi:SentimentService;   
  private _httpClient: HttpClient;

  constructor(store: IBaseStore, context: WebPartContext) {
    super(store);

    this.context = context;
    this.reportViewerApi = new ReportViewerService();
    this.userProfileApi = new UserProfileService();
    this.favoriteApi = new ReportActionsService();
    this.discussionApi= new ReportDiscussionService();
    this.sentimentApi = new SentimentService(this.context);
  }

  @autobind
  public async loadReportData(reportId: any, favReportId: any, defaultHeight?: number, defaultWidth?: number) {
    this.dispatch({ loading: true, error: null });

    let isFavorite: boolean = undefined;

    if ((!reportId || isNaN(reportId)) && (!favReportId || isNaN(favReportId))) 
      return this.dispatchError(`Invalid or missing parameters. reportId: ${reportId}, favReportId: ${favReportId}`, {}, { loading: false });

    let favorite: IFavoriteReport = undefined,
        fvErr: any = undefined;

    if (favReportId) {
      [favorite, fvErr] = await withErrHandler<IFavoriteReport>(this.reportViewerApi.loadFavorite(parseInt(favReportId)));
      if (fvErr) 
        return this.dispatchError(`Invalid or missing favorite report. ${favReportId}`, fvErr, { loading: false});

      if (favorite) 
        reportId = favorite.reportId;
      
      isFavorite = true;
    }
    
    //check again, in case invalid favReportId is provided
    if (!reportId || isNaN(reportId))  
      return this.dispatchError(`Invalid or missing parameters. reportId: ${reportId}`, {}, { loading: false });

    let [report, rvErr] = await withErrHandler<IReportItem>(this.reportViewerApi.loadReportDefinition(parseInt(reportId)));
    if (rvErr) 
      return this.dispatchError(`Report doesn't exists or you don't have permission to view this report: ${reportId}`, rvErr, { loading: false });

    if (!isFavorite) {
      const favorited: IFavoriteState = await this.favoriteApi.GetFavoriteState(this.context.pageContext.web.absoluteUrl, reportId);
      isFavorite = (favorited) ? favorited.isFavorite : false;
    }

    const { SVPReportHeight, SVPReportWidth, SVPVisualizationTechnology } = report;
    const reportHeight = SVPReportHeight || defaultHeight || 700;
    const reportWidth = SVPReportWidth || defaultWidth || 800;

    //if loading Tableau favorite, use URL stored in favorite metadata
    if (SVPVisualizationTechnology === "Tableau" && favorite)
      report.SVPVisualizationAddress = favorite.favoriteReportUrl;

    const modDate: Date = report.SVPLastUpdated || report.Modified;
    if (modDate) {
      report.ModifiedFormatted = moment(modDate).format("M/D/YY");
    }

    report.ReportAnalytics = await this.getReportAnalytics(reportId);
    //expect null 'userProfile' (Profile filtering not used by Sysco)
    //const [userProfile, upErr] = await withErrHandler<IUserProfile>(this.userProfileApi.loadCurrentUserProfile());

    this.dispatch({ 
      loading: false, 
      report, 
      userProfile: undefined, 
      reportHeight, 
      reportWidth,
      isFavorite
    });
  }
  
  @autobind
  public async loadReportDiscussion(reportId: number, reportTitle: string, useSentimentService: boolean, sentimentServiceAPIKey: string, sentimentServiceAPIUrl: string) {
    this.dispatch({ loadingDiscussion: true, error: null });
    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];

    let discussion: IReportDiscussion;
    let replies: Array<IReportDiscussionReply> = undefined;
    let sentimentScore = -10;

    if (state.discussionInitialized) {
      //get from Cache
      discussion = { ...state.discussion };
      replies = [ ...state.discussion.replies ];
      sentimentScore = state.sentimentScore ;
      console.info('loadReportDiscussion > loading from state', discussion);
      console.info('sentimentScore > loading from state', sentimentScore);
    }
    else {
     discussion= await this.discussionApi.loadDiscussion(this.context.pageContext.web.absoluteUrl,this.context.pageContext.web.serverRelativeUrl,reportId,reportTitle);
     if(useSentimentService) {
        sentimentScore = await this.getSentimentFromReportDiscussion(discussion, sentimentServiceAPIKey, sentimentServiceAPIUrl);
     }
    }

    this.dispatch({ 
      loadingDiscussion: false,
      discussion,
      sentimentScore,
      discussionInitialized: true 
    });
  }

  
  @autobind
  public async addReportDiscussionReply(message: string, parentReplyId:number) {
    this.dispatch({ busyDiscussionUpdates: true, error: null });
    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    const replies: Array<IReportDiscussionReply> = [...state.discussion.replies ];
    const discussion:IReportDiscussion = state.discussion;
    const postMessage:IReportDiscussionReply={title:discussion.title,replyBody:message,parentReplyId};
    let reply: IReportDiscussionReply= await this.discussionApi.postReply(this.context.pageContext.web.absoluteUrl,this.context.pageContext.web.serverRelativeUrl,discussion.reportFolderId,postMessage);
    replies.push(reply);
    discussion.replies=replies;
    this.dispatch({ 
      busyDiscussionUpdates: false,
      discussion
    });
  }

  @autobind
  public async updateReportDiscussionReply(message: string,replyId: number) {
    this.dispatch({ busyDiscussionUpdates: true, error: null });

    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    let replies: Array<IReportDiscussionReply> = [...state.discussion.replies ];
    const discussion:IReportDiscussion = state.discussion;
    const postMessage:IReportDiscussionReply={title:discussion.title,replyBody:message,replyId};
    let reply: IReportDiscussionReply= await this.discussionApi.updateReply(this.context.pageContext.web.absoluteUrl,postMessage);
    replies.forEach((r, i) => { if (r.replyId===replyId)
      {
        replies[i].replyBody = reply.replyBody;
        replies[i].createdDate= reply.createdDate;
      } 
    });
    discussion.replies=replies;
    this.dispatch({ 
      busyDiscussionUpdates: false,
      discussion
    });
  }

  @autobind
  public async deleteReportDiscussionReply(discussionReply:IReportDiscussionReply) {
    this.dispatch({ busyDiscussionUpdates: true, error: null });
    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    let replies: Array<IReportDiscussionReply> = [...state.discussion.replies ];
    const discussion:IReportDiscussion = state.discussion;
    let operation:any= await this.discussionApi.deleteReply(this.context.pageContext.web.absoluteUrl,discussionReply);
    let remainingReplies:Array<IReportDiscussionReply>;
    if(discussionReply.parentReplyId===null)
    {
    remainingReplies = replies.filter(
        r=>
        {
          if (r.replyId!==discussionReply.replyId &&
          r.parentReplyId!==discussionReply.replyId)
          return r;
        }
          
      );
      
    }
    else
    {
      remainingReplies = replies.filter(
        r=>
        {
          if (r.replyId!==discussionReply.replyId )
          return r;
        }
          
      );
      
    }
    discussion.replies=remainingReplies;
    this.dispatch({ 
      busyDiscussionUpdates: false,
      discussion
    });
  }

  @autobind
  public async getCurrentUserId()
  {
    // Need to check the dispatch for state CurrentUserId
    const id= await this.discussionApi.getCurrentUserId(this.context.pageContext.web.absoluteUrl);
    return id;
  }

  @autobind
  public async likeComment(currentUserId:number,replyId:number)
  {
    this.dispatch({ busyDiscussionUpdates: true, error: null });
    const state: IReportViewer = this.getState()[REPORT_VIEWER_PATH];
    let replies: Array<IReportDiscussionReply> = [...state.discussion.replies ];
    const discussion:IReportDiscussion = state.discussion;
    let likes:number[]= await this.discussionApi.likeComment(this.context.pageContext.web.absoluteUrl,currentUserId,replyId);
    replies.forEach((r, i) => { if (r.replyId===replyId)
      {
        replies[i].likes=likes;
      } 
    });
    discussion.replies=replies;
    this.dispatch({ 
      busyDiscussionUpdates: false,
      discussion
    });
  }

  @autobind
  public async saveReportAsFavorite(reportId: number, name: string, description: string, viewUrl: string, tableauReportRef?: TableauReport) {
    this.dispatch({ savingAsFavorite: true, error: null });

    if (tableauReportRef) {
      const [viewInfo, errTab] = await withErrHandler<any>(tableauReportRef.saveCustomView(name));
      if (errTab)
        return this.dispatchError(`Unable to save Tableau view: ${reportId}`, errTab, { savingAsFavorite: false});

      viewUrl = viewInfo.url;
    }

    const reportMetadata: any = { 
      "ViewUrl": viewUrl, 
      "ImageUrl": "" 
    };
    
    const [favorite, errFav] = await withErrHandler<IFavoriteState>(this.favoriteApi.FavoriteReport(
      this.context.pageContext.web.absoluteUrl, 
      reportId, 
      description, 
      (tableauReportRef) ? FavoriteType.CUSTOM : FavoriteType.ORIGINAL, 
      undefined, 
      JSON.stringify(reportMetadata),
      name
    ));

    if (errFav || !favorite || favorite.favoriteId === -1) 
      return this.dispatchError(`Unable to favorite report: ${reportId}`, errFav, { savingAsFavorite: false});

    this.dispatch({ savingAsFavorite: false, isFavorite: true, error: null });
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

  @autobind
  private async getSentimentFromReportDiscussion(reportDiscussion: IReportDiscussion, sentimentServiceAPIKey: string, sentimentServiceAPIUrl: string) {
    
    if(reportDiscussion.replies.length>0){
      const sentimentReplies: ISentimentReply[] = reportDiscussion.replies.map((c) => {
          const comment: ISentimentReply = {
              Id: c.replyId,
              replyBody: c.replyBody
          };
          return comment;
      });
      const score = await this.sentimentApi.GetSentimentScore(sentimentReplies, sentimentServiceAPIKey, sentimentServiceAPIUrl);
      
      return score*5;
    }
  }

  private async getReportAnalytics(reportID:number)
  {
    var reportAnalytics:IReportAnalytics = <any>{};

    //TODO - SKS - Get Data from Viz Ext List.
    reportAnalytics.LikeCount=12;
    reportAnalytics.ViewCount=14;

    return reportAnalytics;
  }
  // private async dispatchByPath(path: string, incoming: any) {
  //   await this.dispatcherByPath(path, incoming);
  // }
}
