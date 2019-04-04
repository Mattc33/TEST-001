import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportViewerActions } from "../action/ReportViewActions";
import { 
  IReportItem, 
  IReportDiscussion,
  IReportDiscussionReply,
  IUserProfile, 
  ITableauReportViewerConfig, 
  IErrorResult 
} from "../../../models";

export const REPORT_VIEWER_PATH: string = "reportViewer";

export interface IReportViewerState {
  reportViewer: IReportViewer;
}

export interface IReportViewer {
  context: WebPartContext;

  loading?: boolean;
  savingAsFavorite?: boolean;

  actions?: ReportViewerActions;

  error?: IErrorResult; 

  //report renderer properties
  report?: IReportItem;
  userProfile?: IUserProfile;
  reportHeight?: number;
  reportWidth?: number;
  tableauReportConfig?: ITableauReportViewerConfig;

  //report discussion properties
  loadingDiscussion?: boolean;
  busyDiscussionUpdates?: boolean;
  discussionInitialized?: boolean;
  discussion?: IReportDiscussion;
  replies?: Array<IReportDiscussionReply>;
}
