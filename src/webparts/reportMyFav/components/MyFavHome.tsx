import * as React from 'react';
import styles from './MyFavHome.module.scss';
import { IReportBasicItem } from "../../../models/IReportItem";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface IReportProps {
  key: string;
  reportItem: IReportBasicItem;

  onView(favReportID:string);
  onShare(favReport:IReportBasicItem);
  onRemove(favReport:IReportBasicItem);
}


export default class MyFavHome extends React.Component<IReportProps, {}> {

  

  public render(): React.ReactElement<IReportProps> {
    const rowStyle = {
      display: 'inline-flex',
    };

    const colStyle = {
      background: '#EEF0F2',
    };

    return (
      <div className={styles.myFavHome}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-md-6">
              <img src={this.props.reportItem.SVPVisualizationImage} className={styles.image} />
            </div>
            <div className="col-md-6" style={colStyle}>
                <p className={styles.title}>{this.props.reportItem.Title}</p>
                <p>
                <PrimaryButton data-automation-id="favReportView" text="View" className={styles.button}
                  onClick={(e) => this.props.onView(this.props.reportItem.Id)} />
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
