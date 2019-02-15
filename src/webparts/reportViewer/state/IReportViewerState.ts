import { ReportViewerActions } from "../components/viewer/ReportViewActions";
import { IReportItem } from "../../../models";

export const REPORT_VIEWER_PATH: string = "reportViewer";

export interface IReportViewerState {
  reportViewer: IReportViewer;
}

export interface IReportViewer {
  loading?: boolean;
  report?: IReportItem;
  actions?: ReportViewerActions;
}
