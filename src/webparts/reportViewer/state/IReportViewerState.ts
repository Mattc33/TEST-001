import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportViewerActions } from "../action/ReportViewActions";
import { IReportItem, IUserProfile, ITableauReportViewerConfig } from "../../../models";

export const REPORT_VIEWER_PATH: string = "reportViewer";

export interface IErrorResult {
  errorMessage: string;
  error?: Error;
}

export interface IReportViewerState {
  reportViewer: IReportViewer;
}

export interface IReportViewer {
  context: WebPartContext;

  loading?: boolean;
  savingAsFavorite?: boolean;

  report?: IReportItem;
  userProfile?: IUserProfile;
  
  tableauReportConfig?: ITableauReportViewerConfig;

  actions?: ReportViewerActions;

  error?: IErrorResult; 
}
