import * as React from 'react';
import styles from './MyFavHome.module.scss';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ReportFavoriteType } from "../../../helpers/UrlHelper";

export interface IReportProps {
  key: string;
  reportItem: IReportFavoriteItem;

  onView(favReport:IReportFavoriteItem);
  onShare(favReport:IReportFavoriteItem);
  onRemove(favReport:IReportFavoriteItem);
}


export default class MyFavHome extends React.Component<IReportProps, {}> {

  

  public render(): React.ReactElement<IReportProps> {
    const rowStyle = {
      display: 'inline-flex',
    };

    const colStyle = {
      background: '#EEF0F2',
    };

    let reportTitle = this.props.reportItem.SVPVisualizationLookupTitle;
    if(this.props.reportItem.SVPFavoriteType != ReportFavoriteType.Original) {
      reportTitle = this.props.reportItem.Title;
    }


    let reportImageUrl = this.props.reportItem.SVPVisualizationImage;
    if(this.props.reportItem.SVPFavoriteType != ReportFavoriteType.Original) {
      //TODO: Get the URL from SVPVisualizationMetadata:
      reportImageUrl = "#";
    }

    return (
      <div className={styles.myFavHome}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-md-6">
              <img src={reportImageUrl} className={styles.image} />
            </div>
            <div className="col-md-6" style={colStyle}>
                <p className={styles.title}>{reportTitle}</p>
                <p>
                <PrimaryButton data-automation-id="favReportView" text="View" className={styles.button}
                  onClick={(e) => this.props.onView(this.props.reportItem)} />
                <PrimaryButton data-automation-id="favReportView" text="Share" className={styles.button}
                  onClick={(e) => this.props.onShare(this.props.reportItem)} />
                <PrimaryButton data-automation-id="favReportRemove" text="Remove" className={styles.button}
                  onClick={(e) => this.props.onRemove(this.props.reportItem)} />
                  </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
//TODO
//<p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
////<button className={styles.button} type="button" onClick={(e) => this.props.onView(this.props.reportItem.Id)}>View</button>
//<Link  className={styles.button} href={ favReportViewUrl } target="_self">View </Link>

}
