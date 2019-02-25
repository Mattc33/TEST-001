import { IReportEditorState, IReport, ICountry, IBrand } from "../../webparts/reportEditor/state/IReportEditorState";

export interface IMockService {
    loadReports(count?: number): Promise<Array<IReport>>;
    loadCountries(count?: number): Promise<Array<ICountry>>;
    loadBrands(count?: number): Promise<Array<IBrand>>;
}