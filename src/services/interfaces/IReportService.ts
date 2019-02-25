import { IReportItem } from "../../models/IReportItem";

export interface IReportService {
    getAllFeaturedReports(): Promise<Array<IReportItem>>;
}