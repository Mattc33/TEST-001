import { ReportViewerActions } from "../components/viewer/ReportViewActions";

export const REPORT_VIEWER_PATH: string = "reportViewer";

export interface IReportViewerState {
  reportViewer: IReportViewer;
}

export interface IReportViewer {
  loading?: boolean;
  actions?: ReportViewerActions;
}
