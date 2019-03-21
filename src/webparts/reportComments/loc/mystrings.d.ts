declare interface IReportCommentsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AdvanceGroupName: string;
  ClientNameFieldLabel: string;
  CommentsMaxCount: string;
  VisualizationListID:string;
}

declare module 'ReportCommentsWebPartStrings' {
  const strings: IReportCommentsWebPartStrings;
  export = strings;
}
