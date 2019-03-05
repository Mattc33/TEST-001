import * as React from 'react';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import ReportRotator from '../reportRotator/components/ReportRotator';
import { ReportServiceMock } from "../../services/MockServices/ReportServiceMock";
import { IReportService } from "../../services/interfaces/IReportService";
import { ReportService } from "../../services/ReportService";

export interface IReportRotatorProviderProps{
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

export interface IReportRotatorProviderState{

}

export class ReportRotatorProvider extends React.Component<IReportRotatorProviderProps, IReportRotatorProviderState> {

  private _reportService : IReportService;

  constructor(props: IReportRotatorProviderProps) {
    super(props);

    //this._reportService = new ReportServiceMock();
    this._reportService =  new ReportService(this.props.context);
  }

  public async componentDidMount() {
  }

  public render() : React.ReactElement<IReportRotatorProviderProps> {

    return (
      <ReportRotator
        {...this.props}
        featuredReportService = {this._reportService}
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