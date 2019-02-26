declare interface IReportMyFavWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  HeaderMessageFieldLabel: string;
  ClientNameFieldLabel: string;
  FavReportsMaxCount: string;
}

declare module 'ReportMyFavWebPartStrings' {
  const strings: IReportMyFavWebPartStrings;
  export = strings;
}
