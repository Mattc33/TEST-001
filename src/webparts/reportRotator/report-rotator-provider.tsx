import * as React from 'react';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import ReportRotator from '../reportRotator/components/ReportRotator';
import { ReportServiceMock } from "../../services/ReportServiceMock";
import { IReportService } from "../../services/interfaces/IReportService";

export interface IReportRotatorProviderProps{
  context: WebPartContext;
  enableNavigation: boolean;
  enablePagination: boolean;
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

  private _reportServiceMock : IReportService;

  constructor(props: IReportRotatorProviderProps) {
    super(props);

    this._reportServiceMock = new ReportServiceMock();
  }

  public async componentDidMount() {
  }

  public render() : React.ReactElement<IReportRotatorProviderProps> {

    return (
      <ReportRotator
        {...this.props}
        featuredReportService = {this._reportServiceMock}
        isNavigation= {this.props.enableNavigation}
        isPagination ={this.props.enablePagination}
        isAutoplay= {this.props.enableAutoplay}
        isGrabCursor = {this.props.enableGrabCursor}
        isLoop = {this.props.enableLoop}
        isAutoplayOnInteraction = {this.props.enableAutoplay}
        autoplayTime = {this.props.delayAutoplay}
        reportPerView = {this.props.slidesPerView}
        reportPerGroup = {this.props.slidesPerGroup}
        spaceBetweenReports = {this.props.spaceBetweenSlides}
      />
    );


  }

}