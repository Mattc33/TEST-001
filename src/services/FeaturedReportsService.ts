import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult, Web } from '@pnp/sp';
import { IFeaturedReportsService } from ".";
import { IReportItem, IReportFavoriteItem, IFavoriteReport } from "../models";

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
    
    public loadReports(pageNbr: number, pageSize: number, sortField: string): Promise<Array<IReportItem>> {
        return Promise.resolve([]);
    }
}