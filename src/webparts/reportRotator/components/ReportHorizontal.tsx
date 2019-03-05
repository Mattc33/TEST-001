import * as React from 'react';
import styles from './ReportHorizontal.module.scss';
import { IReportBasicItem } from "../../../models/IReportItem";

export interface IReportProps {
  key: number;
  reportItem: IReportBasicItem;
  siteUrl:string;
}


export default class ReportHorizontal extends React.Component<IReportProps, {}> {

  public render(): React.ReactElement<IReportProps> {
    const rowStyle = {
      display: 'inline-flex',
    };

    const colStyle = {
      background: '#EEF0F2',
    };

    const reportURL = this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + this.props.reportItem.Id;

    return (
      <div className={styles.reportHorizontal}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-md-6">
              <img src={this.props.reportItem.SVPVisualizationImage} className={styles.image} />
            </div>
            <div className="col-md-6" style={colStyle}>
              <a href={reportURL} className={styles.url}>
                <h4 className={styles.title}>{this.props.reportItem.Title}</h4>
              </a>  
              <p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
