import * as React from 'react';
import styles from './NewsRotator.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { NewsServiceMock } from "../../../services/MockServices/NewsServiceMock";
import { INewsService } from "../../../services/interfaces/INewsService";
import { INewsItem } from "../../../models/INewsItem";
import Swiper from 'swiper/dist/js/swiper';
import { autobind } from '@uifabric/utilities/lib';
import NewsHorizontal  from "./NewsHorizontal";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';


//import ReportHorizontal from "./ReportHorizontal";

export interface INewsRotatorProps {
  featuredNewsService: INewsService;
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
  currentSiteUrl:string;
}

export interface INewsRotatorState {
  featuredNewsItemsinState: INewsItem[];
  isNewsLoaded: Boolean;
}

export default class NewsRotator extends React.Component<INewsRotatorProps, INewsRotatorState> {

  private uniqueId: number;

  constructor(props: INewsRotatorProps) {
    super(props);
    this.state = { featuredNewsItemsinState: [], isNewsLoaded: false};

    this.uniqueId = Math.floor(Math.random() * 10000) + 1;

  }

  public componentDidMount(): void { 
    this.props.featuredNewsService.getAllFeaturedNews().then((result: Array<INewsItem>) => {

      this.setState({ featuredNewsItemsinState: result, isNewsLoaded: true});
      this.setSwiper();
    });

}

  public render(): React.ReactElement<INewsRotatorProps> {
    console.log ("News in State: ", this.state.featuredNewsItemsinState);

    return (
      <div className={styles.newsRotator}>

        <div className={`swiper-container ${styles.container} container-${this.uniqueId}`}>
          <div className='swiper-wrapper'>
            {!this.state.isNewsLoaded &&
              <div className="row">
                <div className={`col-xs-12 ${styles.spinner}`}>
                  <Spinner size={SpinnerSize.large} label="Wait, Pulling Featured Reports..." ariaLive="assertive" />
                </div>
              </div>
              
            }
            {this.state.featuredNewsItemsinState.length > 0 &&
              this.state.featuredNewsItemsinState.map((newsItem, i) => {
                return <div className={`swiper-slide ${styles.slide}`} key={i}>
                  <NewsHorizontal newsItem ={newsItem} key={i} siteUrl={this.props.currentSiteUrl}/> 
                </div>;
              })}
          </div>

          {this.props.isNavigation && this.state.featuredNewsItemsinState.length > 0 &&
            <div className={`swiper-button-next next-${this.uniqueId}`}></div>
          }
          {this.props.isNavigation && this.state.featuredNewsItemsinState.length > 0 &&
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
