import { PagedItemCollection } from '@pnp/sp';
import { IReportItem, IFilter, IPaging, ISort } from "../../models";

export interface IFeaturedReportsService {
    loadFilter(webUrl: string, filterName: string): Promise<Array<string>>;
    loadReports(webUrl: string, filter: IFilter, paging: IPaging, sort: ISort): Promise<PagedItemCollection<IReportItem[]>>;
}