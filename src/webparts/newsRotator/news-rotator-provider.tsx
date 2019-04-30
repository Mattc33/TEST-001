import * as React from 'react';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import NewsRotator from './components/NewsRotator';
import { NewsServiceMock } from "../../services/MockServices/NewsServiceMock";
import { INewsService } from "../../services/interfaces/INewsService";
//import { ReportService } from "../../services/ReportService";

export interface INewsRotatorProviderProps{
  context: WebPartContext;
  clientLabel:string;
  enableNavigation: boolean;
  enablePagination: boolean;
  enableVerticalReport:boolean;
  enableAutoplay: boolean;
  delayAutoplay: number;
  disableAutoplayOnInteraction: boolean;
  slidesPerView: string;
  slidesPerGroup: string;
  spaceBetweenSlides: string;
  enableGrabCursor: boolean;
  enableLoop: boolean;
}

export interface INewsRotatorProviderState{

}

export class NewsRotatorProvider extends React.Component<INewsRotatorProviderProps, INewsRotatorProviderState> {

  private _newsService : INewsService;

  constructor(props: INewsRotatorProviderProps) {
    super(props);

    this._newsService = new NewsServiceMock();
    //this._newsService =  new NewsServiceMock(this.props.context);
  }

  public async componentDidMount() {
  }

  public render() : React.ReactElement<INewsRotatorProviderProps> {

    return (
      <NewsRotator
        {...this.props}
        featuredNewsService = {this._newsService}
        isNavigation= {this.props.enableNavigation}
        isPagination ={this.props.enablePagination}
        isReportVerticle ={this.props.enableVerticalReport}
        isAutoplay= {this.props.enableAutoplay}
        isGrabCursor = {this.props.enableGrabCursor}
        isLoop = {this.props.enableLoop}
        isAutoplayOnInteraction = {this.props.enableAutoplay}
        autoplayTime = {this.props.delayAutoplay}
        reportPerView = {this.props.slidesPerView}
        reportPerGroup = {this.props.slidesPerGroup}
        spaceBetweenReports = {this.props.spaceBetweenSlides}
        currentSiteUrl = {this.props.context.pageContext.site.absoluteUrl}
        
      />
    );


  }

}