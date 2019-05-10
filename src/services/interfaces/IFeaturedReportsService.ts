import { IReportItem, IFilter } from "../../models";

export interface IFeaturedReportsService {
    loadReports(filter: IFilter, pageNbr: number, pageSize: number, sortField: string, isAsc: boolean): Promise<Array<IReportItem>>;
}