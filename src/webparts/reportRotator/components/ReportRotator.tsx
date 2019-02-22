import * as React from 'react';
import styles from './ReportRotator.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import Swiper from "swiper/dist/js/swiper";

import { IReportItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities/lib';
import Report from "./Report";
import { IReportService } from "../../../services/interfaces/IReportService";


export interface IReportRotatorProps {
  featuredReportService: IReportService;
  isNavigation: boolean;
  isPagination: boolean;
  isAutoplay: boolean;
  isGrabCursor: boolean;
  isLoop: boolean;
  isAutoplayOnInteraction: boolean;
  autoplayTime: number;
  reportPerView: string;
  reportPerGroup: string;
  spaceBetweenReports: string;
}

export interface IReportRotatorState {
  featuredReportItemsinState: IReportItem[];
}

export default class ReportRotator extends React.Component<IReportRotatorProps, IReportRotatorState> {
  
  private uniqueId: number;

  constructor(props: IReportRotatorProps) {
    super(props);
    this.state = { featuredReportItemsinState: [] };

    this.uniqueId = Math.floor(Math.random() * 10000) + 1;

  }

  public componentDidMount(): void { 
      this.props.featuredReportService.getAllFeaturedReports().then((result: Array<IReportItem>) => {

        this.setState({ featuredReportItemsinState: result });
        this.setSwiper();

      });

      this.setSwiper();

      
  }

  public render(): React.ReactElement<IReportRotatorProps> {
    console.log ("Report in State: ", this.state.featuredReportItemsinState);

    return (
      <div className={styles.reportRotator}>

        <div className={`swiper-container ${styles.container} container-${this.uniqueId}`}>
          <div className='swiper-wrapper'>
            {this.state.featuredReportItemsinState.length &&
              this.state.featuredReportItemsinState.map((reportItem, i) => {
                return <div className={`swiper-slide ${styles.slide}`} key={i}>

                  <Report reportItem ={reportItem} key={i} />

                </div>;
              })}
          </div>

          {this.props.isNavigation &&
            <div className={`swiper-button-next next-${this.uniqueId}`}></div>
          }
          {this.props.isNavigation &&
            <div className={`swiper-button-prev prev-${this.uniqueId}`}></div>
          }

          {this.props.isPagination !== false &&
            <div className={`swiper-pagination pagination-${this.uniqueId}`}></div>
          }
        </div>
      </div>
    );
  }

  @autobind
  private setSwiper(): void {
    //const opts = this.props.swiperOptions;

    const options: any = {
      slidesPerView: parseInt(this.props.reportPerView) || 3,
      slidesPerGroup: parseInt(this.props.reportPerGroup) || 3,
      spaceBetween: parseInt(this.props.spaceBetweenReports) || 10,
      loop: this.props.isLoop || false,
      grabCursor: this.props.isGrabCursor || false,
      breakpoints: {
        1024: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 5,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 5,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 5,
        }
      }
    };

    if (this.props.isPagination !== false) {

      options.pagination = {
        el: `.pagination-${this.uniqueId}`,
        clickable: true,
      };
    }

    if (this.props.isNavigation) {

      options.navigation = {
        nextEl: `.next-${this.uniqueId}`,
        prevEl: `.prev-${this.uniqueId}`,
      };
    }

    if (this.props.isAutoplay) {

      options.autoplay = {
        delay: this.props.autoplayTime,
        disableOnInteraction:  this.props.isAutoplayOnInteraction,
      };
    }

    // tslint:disable-next-line:no-unused-expression
    new Swiper(`.container-${this.uniqueId}`, options);
  }

}
