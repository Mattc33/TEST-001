import { sp, RenderListDataParameters } from '@pnp/sp';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { IReportItem } from "../models/IReportItem";
import { IReportService } from "./interfaces/IReportService";
import { Caml } from "./utils/Caml";

const VIZ_REPORT_LST = "Visualizations";

export class ReportService implements IReportService {

    constructor(private context: IWebPartContext) {
    
    }

    public async getAllFeaturedReports(): Promise<Array<IReportItem>> {

        const query = Caml.getCaml(
            () => this.getVizReportListViewFields().map((field: string): string => {
                return `<FieldRef Name="${field}" />`;
              }).join(''),
            () => Caml.getQueryXmlFrom(
                () => "<Eq><FieldRef Name='SVPIsFeatured' /><Value Type='Boolean'>1</Value></Eq>",
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

        return this.processVizReportListResult(result);

    }
    

    private processVizReportListResult(result: any): Array<IReportItem> {

        if (result && result.Row && !!result.Row.length) {

        const reports: Array<IReportItem> = result.Row.map((r: any): IReportItem => {

            const item: IReportItem = {
                Id: r.ID,
                Title: r.Title,
                SVPVisualizationImage: r.SVPVisualizationImage,
                SVPVisualizationDescription:r.SVPVisualizationDescription
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
            'SVPVisualizationImage',
        ];
    }


}
  