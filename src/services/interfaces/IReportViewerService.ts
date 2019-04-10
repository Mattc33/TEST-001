import { IReportItem, IFavoriteReport } from "../../models";

export interface IReportViewerService {
    loadReportDefinition(reportId: number): Promise<IReportItem>;
    loadFavorite(favoriteId: number): Promise<IFavoriteReport>;
    loadReportDefinitionByUrl(reportUrl: string, reportItem: IReportItem): Promise<IReportItem>;
}