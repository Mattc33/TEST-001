declare interface IReportMyFavWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AdvanceGroupName: string;
  HeaderMessageFieldLabel: string;
  ClientNameFieldLabel: string;
  FavReportsMaxCount: string;
  VisualizationTitleFieldLabel:string;
  VisualizationImageFieldLabel:string;
}

declare module 'ReportMyFavWebPartStrings' {
  const strings: IReportMyFavWebPartStrings;
  export = strings;
}
