import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult, Web } from '@pnp/sp';
import { IReportViewerService } from ".";
import { IReportItem, IReportFavoriteItem, IFavoriteReport } from "../models";
import { FavoriteType } from './ReportActionsService/ReportActionsService';

const VizListTitle = "Visualizations";
const FavoriteListTitle = "Favorites";

const VizListFields = [
    "Id",
    "Title",
    "SVPVisualizationAddress",
    "SVPVisualizationMetadata",
    "SVPVisualizationTechnology",
    "SVPLastUpdated",
    "SVPVisualizationDescription",
    "SVPVisualizationImage",
    "SVPIsFeatured",
    "SVPBusinessUnit",
    "SVPDepartment",
    "SVPReportHeight",
    "SVPReportWidth",
    "SVPMetadata1",          //Purpose
    "SVPMetadata2",          //Process
    "SVPMetadata3",         //Area
    "SVPMetadata4",         //Role
    "SVPVisualizationLearning",
    "Modified",
    "Created",
    "SVPVisualizationParameters/Id",
    "SVPVisualizationParameters/SVPParameterName",
    "SVPVisualizationParameters/SVPParameterValue",
    "SVPVisualizationOwner/Id",
    "SVPVisualizationOwner/Title",
    "SVPVisualizationOwner/EMail"
];

const FavoriteListFields = [
    "Id",
    "Title",
    "SVPVisualizationLookupId",
    "SVPVisualizationMetadata",
    "SVPFavoriteType"
];


export class ReportViewerService implements IReportViewerService {

    public async loadReportDefinition(reportId: number): Promise<IReportItem> {
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

    public async loadFavorite(favoriteId: number): Promise<IFavoriteReport> {
        const selectFields = FavoriteListFields.join(",");

        const favorite = await sp
            .web
            .lists
                .getByTitle(FavoriteListTitle)
            .items
                .getById(favoriteId)
                .select(selectFields)
                .get<IReportFavoriteItem>();

        let favoriteReport: IFavoriteReport = undefined;

        if (favorite) {
            if (favorite.SVPFavoriteType === FavoriteType.CUSTOM) { //Tablue report
                if (!favorite.SVPVisualizationMetadata)
                    throw new Error("Favorite metadata field is empty");

                const metadata: any = JSON.parse(favorite.SVPVisualizationMetadata);
                favoriteReport = {
                    favoriteReportUrl: metadata.ViewUrl,
                    reportId: favorite.SVPVisualizationLookupId
                };
            }
            else { //all other
                const report: IReportItem = await this.loadReportDefinition(favorite.SVPVisualizationLookupId);
                if (report) {
                    favoriteReport = {
                        favoriteReportUrl: report.SVPVisualizationAddress,
                        reportId: favorite.SVPVisualizationLookupId
                    };
                }
            }
        }

        return favoriteReport;
    }

    public async loadReportDefinitionByUrl(reportUrl: string, reportItem: IReportItem): Promise<IReportItem> {
        // const reportUrl = "https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/TEST1/Shared%20Documents/Visualization%20Document.docx";
        //                    https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/TEST1/Shared%20Documents/Visualization%20Presentation.pptx
        // const reportUrl = 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/Shared%20Documents/Book1.xlsx';
        // find the web url (if file URL is from sub-web)
        const webUrl = await sp
            .site
                .getWebUrlFromPageUrl(reportUrl);

        const relReportUrl = reportUrl.replace(window.location.protocol + '//' + window.location.hostname, '');

        let web: Web = new Web(webUrl);
        const item = await web
            .getFileByServerRelativeUrl(relReportUrl)
            .getItem<IReportItem>('FileLeafRef', 'UniqueId');

        const { FileLeafRef, UniqueId } = item;
        const report = { ...reportItem, FileLeafRef, UniqueId, FileWebUrl: webUrl };

        return report;
    }
}