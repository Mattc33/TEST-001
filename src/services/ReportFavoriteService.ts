import { sp, RenderListDataParameters } from '@pnp/sp';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { IReportFavoriteItem } from "../models/IReportItem";
import { IReportFavoriteService } from "./interfaces/IReportFavoriteService";
import { Caml } from "./utils/Caml";

const VIZ_REPORT_LST = "Favorites";

export class ReportFavoriteService implements IReportFavoriteService {

    constructor(private context: IWebPartContext) {
    
    }

    public async getMyFavoriteReports():Promise<Array<IReportFavoriteItem>> {
        const query = Caml.getCaml(
            () => this.getVizReportListViewFields().map((field: string): string => {
                return `<FieldRef Name="${field}" />`;
              }).join(''),
            () => Caml.getQueryXmlFrom(
                () => "<Eq><FieldRef Name='Author' LookupId='TRUE' /><Value Type='Integer'><UserID/></Value></Eq>",
                () => "<FieldRef Name='Modified' Ascending='FALSE'/>"
            ),
            100
        );
      
        const parameters: RenderListDataParameters = {
            ViewXml: query
        };
      
        const result = await sp
            .web
            .lists
              .getByTitle(VIZ_REPORT_LST)
              .renderListDataAsStream(parameters);

        return this.processFavReportListResult(result);
    }



    private processFavReportListResult(result: any): Array<IReportFavoriteItem> {

        if (result && result.Row && !!result.Row.length) {

        const reports: Array<IReportFavoriteItem> = result.Row.map((r: any): IReportFavoriteItem => {

            const item: IReportFavoriteItem = {
                Id: r.ID,
                Title: r.Title,
                SVPVisualizationDescription:r.SVPVisualizationDescription,
                SVPFavoriteType:r.SVPFavoriteType,
                SVPVisualizationLookupId: (r.Visualization_x0020_Lookup_x003a.length > 0 ? r.Visualization_x0020_Lookup_x003a[0].lookupId : ""),
                SVPVisualizationLookupTitle: (r.Visualization_x0020_Lookup_x003a.length > 0 ? r.Visualization_x0020_Lookup_x003a[0].lookupValue : ""),
                SVPVisualizationImage: (r.Visualization_x0020_Lookup_x003a0.length > 0 ? r.Visualization_x0020_Lookup_x003a0[0].lookupValue : ""),
                SVPVisualizationMetadata: r.SVPVisualizationMetadata
            };
            return item;
        });

        return reports;

        }

        return [];
    }


    private getVizReportListViewFields(): string[] {
        return [
            'ID',
            'Title',
            'SVPVisualizationDescription',
            'SVPFavoriteType',
            'SVPVisualizationLookup',
            'Visualization_x0020_Lookup_x003a',
            'Visualization_x0020_Lookup_x003a0',
            'SVPVisualizationMetadata'
        ];
    }



}