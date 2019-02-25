declare interface IReportRotatorWebPartStrings {
  ReportOptions: string;
  GeneralGroupName: string;
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
}

declare module 'ReportRotatorWebPartStrings' {
  const strings: IReportRotatorWebPartStrings;
  export = strings;
}
