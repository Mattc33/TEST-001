
export interface IReportViewerState {

}

export interface IReportViewer {
    loading?: boolean;
    reports?: Array<IReport>;
    countries?: Array<ICountry>;
    brands?: Array<IBrand>;
    actions?: ReportViewerActions;
    countryEntities?: IEntity<ICountry>;
}