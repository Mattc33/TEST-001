import { IReportItem, IFilter } from "../../models";

export interface IFeaturedReportsService {
    loadFilter(webUrl: string, filterName: string): Promise<Array<string>>;
    loadReports(webUrl: string, filter: IFilter, pageNbr: number, pageSize: number, sortField: string, isAsc: boolean): Promise<Array<IReportItem>>;
}