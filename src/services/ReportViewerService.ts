import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult } from '@pnp/sp';
import { IReportViewerService } from ".";
import { IReportItem } from "../models";

const VizListTitle = "Visualizations";

export class ReportViewerService implements IReportViewerService {

    public loadReportDefinition(reportId: number): Promise<IReportItem> {
        return sp
            .web
            .lists
                .getByTitle(VizListTitle)
            .items
                .getById(reportId)
                .select('*,SVPVisualizationParameters/Id,SVPVisualizationParameters/SVPParameterName,SVPVisualizationParameters/SVPParameterValue,SVPVisualizationOwner/Id,SVPVisualizationOwner/Title,SVPVisualizationOwner/EMail')
                .expand('SVPVisualizationParameters, SVPVisualizationOwner')
                .get();
    }
}