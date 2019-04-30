declare interface INewsRotatorWebPartStrings {
  NewsOptions: string;
  BasicGroupName: string;
  EnableNavigation: string;
  EnableVerticalReport:string;
  EnablePagination: string;
  NewsPerView: string;
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

declare module 'NewsRotatorWebPartStrings' {
  const strings: INewsRotatorWebPartStrings;
  export = strings;
}
