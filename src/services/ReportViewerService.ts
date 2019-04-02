import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult, Web } from '@pnp/sp';
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

    public async loadReportDefinition(reportId: number): Promise<IReportItem> {
        // const fileUrl = 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/Shared%20Documents/Book1.xlsx';
        // const r = await sp.site.getWebUrlFromPageUrl(fileUrl);

        // const relFileUrl = fileUrl.replace(window.location.protocol + '//' + window.location.hostname, '');
        // console.info('loadReportDefinition', relFileUrl, r);

        // let web: Web = new Web(r);
        // const item = await web.getFileByServerRelativeUrl(relFileUrl).getItem('FileLeafRef', 'UniqueId');
        // console.info('loadReportDefinition', relFileUrl, item);


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