import * as React from 'react';
import styles from './ReportRotator.module.scss';
import Swiper from 'swiper/dist/js/swiper';

import { IReportItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities/lib';
import ReportVerticle from "./ReportVerticle";
import ReportHorizontal from "./ReportHorizontal";
import { IReportService } from "../../../services/interfaces/IReportService";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export interface IReportRotatorProps {
  featuredReportService: IReportService;
  isNavigation: boolean;
  isPagination: boolean;
  isReportVerticle:boolean;
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
  isReportsLoaded: Boolean;
}

export default class ReportRotator extends React.Component<IReportRotatorProps, IReportRotatorState> {
  
  private uniqueId: number;

  constructor(props: IReportRotatorProps) {
    super(props);
    this.state = { featuredReportItemsinState: [], isReportsLoaded: false};

    this.uniqueId = Math.floor(Math.random() * 10000) + 1;

  }

  public componentDidMount(): void { 
      this.props.featuredReportService.getAllFeaturedReports().then((result: Array<IReportItem>) => {

        this.setState({ featuredReportItemsinState: result, isReportsLoaded: true});
        this.setSwiper();
      });

  }

  public render(): React.ReactElement<IReportRotatorProps> {
    console.log ("Report in State: ", this.state.featuredReportItemsinState);

    return (
      <div className={styles.reportRotator}>

        <div className={`swiper-container ${styles.container} container-${this.uniqueId}`}>
          <div className='swiper-wrapper'>
            {!this.state.isReportsLoaded &&
              <div className="row">
                <div className="col-xs-12"><Spinner size={SpinnerSize.large} label="Wait, Pulling Featured Reports..." ariaLive="assertive" /></div>
              </div>
              
            }
            {this.state.featuredReportItemsinState.length > 0 &&
              this.state.featuredReportItemsinState.map((reportItem, i) => {
                return <div className={`swiper-slide ${styles.slide}`} key={i}>
                  {this.props.isReportVerticle 
                  ? <ReportVerticle reportItem ={reportItem} key={i} /> 
                  : <ReportHorizontal reportItem ={reportItem} key={i} />
                  }
                  

                </div>;
              })}
          </div>

          {this.props.isNavigation && this.state.featuredReportItemsinState.length > 0 &&
            <div className={`swiper-button-next next-${this.uniqueId}`}></div>
          }
          {this.props.isNavigation && this.state.featuredReportItemsinState.length > 0 &&
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
