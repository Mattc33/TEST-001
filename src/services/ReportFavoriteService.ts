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
          
            const _SVPVisualizationLookupId = this.returnValue(r.SVPVisualizationLookup);
            const _SVPVisualizationLookupTitle = this.returnValue(r.Visualization_x0020_Lookup_x003a);
            const _SVPVisualizationImage = this.returnValue(r.Visualization_x0020_Lookup_x003a0);

            const item: IReportFavoriteItem = {
                Id: r.ID,
                Title: r.Title,
                SVPVisualizationDescription:r.SVPVisualizationDescription,
                SVPFavoriteType:r.SVPFavoriteType,
                SVPVisualizationLookupId: _SVPVisualizationLookupId,
                SVPVisualizationLookupTitle: _SVPVisualizationLookupTitle,
                SVPVisualizationImage: _SVPVisualizationImage,
                SVPVisualizationMetadata: r.SVPVisualizationMetadata
            };
            return item;
        });

        return reports;

        }

        return [];
    }

    private returnValue(object:any):string {

        if(Array.isArray(object)) {
            return (object ? object[0].lookupValue : "");
        }
        else {
            return object;
        }


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