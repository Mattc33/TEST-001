import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportViewerActions } from "../components/viewer/ReportViewActions";
import { IReportItem, IUserProfile } from "../../../models";

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
  
  actions?: ReportViewerActions;

  error?: IErrorResult; 
}
