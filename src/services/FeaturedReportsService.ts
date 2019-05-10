import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult, Web } from '@pnp/sp';
import { IFeaturedReportsService } from ".";
import { IReportItem, IFilter } from "../models";

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
    "SVPMetadata1",          //segment
    "SVPMetadata2",          //function
    "SVPMetadata3",          //frequency
    "SVPReportHeight",
    "SVPReportWidth",
    "Modified",
    "Created",
    "SVPVisualizationOwner/Id",
    "SVPVisualizationOwner/Title",
    "SVPVisualizationOwner/EMail"
];


export class FeaturedReportsService implements IFeaturedReportsService {

    constructor() {
        
    }
    
    public async loadFilter(webUrl: string, filterName: string): Promise<Array<string>> {
        const web: Web = new Web(webUrl);
        const field = await web
            .fields
                .getByInternalNameOrTitle(filterName)
                .select("Title", "Choices")
                .get();

        return (field && field.Choices) ? field.Choices : [];
    }

    public loadReports(webUrl: string, filter: IFilter, pageNbr: number, pageSize: number, sortField: string, isAsc: boolean): Promise<Array<IReportItem>> {
        return Promise.resolve([]);
    }
}