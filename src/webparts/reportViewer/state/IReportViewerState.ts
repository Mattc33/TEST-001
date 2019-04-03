import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportViewerActions } from "../action/ReportViewActions";
import { IReportDiscussionState } from "../../controls/ReportDiscussion";
import { IReportItem, IUserProfile, ITableauReportViewerConfig, IErrorResult  } from "../../../models";

export const REPORT_VIEWER_PATH: string = "reportViewer";

export interface IReportViewerState {
  reportViewer: IReportViewer;
  reportDiscussion: IReportDiscussionState;
}

export interface IReportViewer {
  context: WebPartContext;

  loading?: boolean;
  savingAsFavorite?: boolean;

  report?: IReportItem;
  userProfile?: IUserProfile;
  reportHeight?: number;
  reportWidth?: number;
  
  tableauReportConfig?: ITableauReportViewerConfig;

  actions?: ReportViewerActions;

  error?: IErrorResult; 
}
