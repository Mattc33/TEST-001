import { sp, RenderListDataParameters } from '@pnp/sp';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { IReportFavoriteItem } from "../models/IReportItem";
import { IReportFavoriteService } from "./interfaces/IReportFavoriteService";
import { Caml } from "./utils/Caml";

const VIZ_REPORT_LST = "Favorites";

export class ReportFavoriteService implements IReportFavoriteService {

    private _visualizationTitle:string;
    private _visualizationImage:string;

    constructor(private context: IWebPartContext) {
    
    }

    public async getMyFavoriteReports(visualizationTitle:string, visualizationImage:string,favReportCounts:number):Promise<Array<IReportFavoriteItem>> {
        
        this._visualizationTitle = visualizationTitle;
        this._visualizationImage= visualizationImage;
        
        const query = Caml.getCaml(
            () => this.getVizReportListViewFields().map((field: string): string => {
                return `<FieldRef Name="${field}" />`;
              }).join(''),
            () => Caml.getQueryXmlFrom(
                () => "<Eq><FieldRef Name='Author' LookupId='TRUE' /><Value Type='Integer'><UserID/></Value></Eq>",
                () => "<FieldRef Name='Modified' Ascending='FALSE'/>"
            ),
            favReportCounts
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
            const _SVPVisualizationLookupTitle = this.returnValue(r[this._visualizationTitle]);
            const _SVPVisualizationImage = this.returnValue(r[this._visualizationImage]);

            const item: IReportFavoriteItem = {
                Id: r.ID,
                Title: r.Title,
                SVPVisualizationDescription:r.SVPVisualizationDescription,
                SVPFavoriteType:r.SVPFavoriteType,
                SVPVisualizationLookupId: Number.parseInt(_SVPVisualizationLookupId),
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
            this._visualizationTitle,
            this._visualizationImage,
            'SVPVisualizationMetadata'
        ];
    }



}