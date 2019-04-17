import { IReportItem } from "../../models";

export interface IFeaturedReportsService {
    loadReports(pageNbr: number, pageSize: number, sortField: string): Promise<Array<IReportItem>>;
}