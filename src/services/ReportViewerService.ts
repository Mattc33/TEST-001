import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult } from '@pnp/sp';
import { IReportViewerService } from ".";
import { IReportItem } from "../models";

const VizListTitle = "Visualizations";

const VizListFields = [
    "Id",
    "Title",
    "SVPVisualizationAddress",
    "SVPVisualizationMetadata",
    "SVPVisualizationTechnology",
    "SVPLastUpdated",
    "SVPVisualizationDescription",
    "SVPVisualizationImage",
    "SVPBusinessUnit",
    "SVPIsFeatured",
    "SVPCategory",
    "SVPReportHeight",
    "SVPReportWidth",
    "SVPLikes",
    "SVPLikesCount",
    "Modified",
    "Created",
    "SVPVisualizationParameters/Id",
    "SVPVisualizationParameters/SVPParameterName",
    "SVPVisualizationParameters/SVPParameterValue",
    "SVPVisualizationOwner/Id",
    "SVPVisualizationOwner/Title",
    "SVPVisualizationOwner/EMail"
];

export class ReportViewerService implements IReportViewerService {

    public loadReportDefinition(reportId: number): Promise<IReportItem> {
        const selectFields = VizListFields.join(",");

        return sp
            .web
            .lists
                .getByTitle(VizListTitle)
            .items
                .getById(reportId)
                .select(selectFields)
                .expand('SVPVisualizationParameters, SVPVisualizationOwner')
                .get();
    }
}