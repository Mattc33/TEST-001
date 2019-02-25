import { IReportItem } from "../../models";

export interface IReportViewerService {
    loadReportDefinition(reportId: number): Promise<IReportItem>;
}