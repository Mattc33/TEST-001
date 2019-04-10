declare interface IReportMyFavWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AdvanceGroupName: string;
  HeaderMessageFieldLabel: string;
  ClientNameFieldLabel: string;
  ViewNameFieldLabel: string;
  FavReportsMaxCount: string;
  VisualizationTitleFieldLabel:string;
  VisualizationImageFieldLabel:string;
}

declare module 'ReportMyFavWebPartStrings' {
  const strings: IReportMyFavWebPartStrings;
  export = strings;
}
