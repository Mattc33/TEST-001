import { sp, RenderListDataParameters } from '@pnp/sp';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { INewsItem } from "../models/INewsItem";
import { INewsService } from "./interfaces/INewsService";
import { Caml } from "./utils/Caml";

const VIZ_NEWS_LST = "Home News";

export class NewsService implements INewsService {

    constructor(private context: IWebPartContext) {
    
    }

    public async getAllFeaturedNews(listName:string): Promise<Array<INewsItem>> {

        let newsListName = listName;
        if(!newsListName)
            newsListName = VIZ_NEWS_LST;

        const query = Caml.getCaml(
            () => this.getVizReportListViewFields().map((field: string): string => {
                return `<FieldRef Name="${field}" />`;
              }).join(''),
            () => Caml.getQueryXmlFrom(
                () => "<Eq><FieldRef Name='SVPNewsShowOnHome' /><Value Type='Boolean'>1</Value></Eq>",
                () => "<FieldRef Name='Modified' Ascending='FALSE'/>"
            ),
            100
        );
      
        const parameters: RenderListDataParameters = {
            ViewXml: query
        };
      
        const result = await sp.web.lists.getByTitle(newsListName).renderListDataAsStream(parameters);

        return this.processVizReportListResult(result);

    }
    

    private processVizReportListResult(result: any): Array<INewsItem> {

        if (result && result.Row && !!result.Row.length) {

        const reports: Array<INewsItem> = result.Row.map((r: any): INewsItem => {

            const item: INewsItem = {
                Id: r.ID,
                Title: r.Title,
                SVPNewsSubTitle: r.SVPNewsSubTitle,
                SVPNewsBackgroundImage:r.SVPNewsBackgroundImage
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
            'SVPNewsSubTitle',
            'SVPNewsBackgroundImage',
        ];
    }


}
  