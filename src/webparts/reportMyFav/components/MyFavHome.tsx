import * as React from 'react';
import styles from './MyFavHome.module.scss';
import { IReportBasicItem } from "../../../models/IReportItem";
import { Link } from 'office-ui-fabric-react/lib/Link';

export interface IReportProps {
  key: string;
  reportItem: IReportBasicItem;

  onView(reportId:string);
}


export default class MyFavHome extends React.Component<IReportProps, {}> {

  

  public render(): React.ReactElement<IReportProps> {
    const rowStyle = {
      display: 'inline-flex',
    };

    const colStyle = {
      background: '#EEF0F2',
    };

    const favReportViewUrl = "https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SitePages/ViewReport.aspx?reportId=" + this.props.reportItem.Id;

    return (
      <div className={styles.myFavHome}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-md-6">
              <img src={this.props.reportItem.SVPVisualizationImage} className={styles.image} />
            </div>
            <div className="col-md-6" style={colStyle}>
                <p className={styles.title}>{this.props.reportItem.Title}</p>
                <p><Link  className={styles.button} href={ favReportViewUrl } target="_self">View </Link></p>
                 
            </div>
          </div>
        </div>
      </div>
    );
  }
//TODO
//<p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
////<button className={styles.button} type="button" onClick={(e) => this.props.onView(this.props.reportItem.Id)}>View</button>
  
}
