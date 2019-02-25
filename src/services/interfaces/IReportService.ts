import { IReportBasicItem } from "../../models/IReportItem";

export interface IReportService {
    getAllFeaturedReports(): Promise<Array<IReportBasicItem>>;
}