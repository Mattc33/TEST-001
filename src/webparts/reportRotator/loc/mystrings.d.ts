declare interface IReportRotatorWebPartStrings {
  ReportOptions: string;
  BasicGroupName: string;
  EnableNavigation: string;
  EnableVerticalReport:string
  EnablePagination: string;
  ReportsPerView: string;
  AutoplayGroupName: string;
  EnableAutoplay: string;
  DelayAutoplay: string;
  Miliseconds: string;
  DisableAutoplayOnInteraction: string;
  AdvancedGroupName: string;
  SlidesPerGroup: string;
  SpaceBetweenSlides: string;
  InPixels: string;
  EnableGrabCursor: string;
  EnableLoop: string;
  ClientNameFieldLabel:string;
}

declare module 'ReportRotatorWebPartStrings' {
  const strings: IReportRotatorWebPartStrings;
  export = strings;
}
