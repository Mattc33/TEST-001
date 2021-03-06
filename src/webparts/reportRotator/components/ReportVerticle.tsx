import * as React from 'react';
import styles from './ReportVerticle.module.scss';
import { IReportBasicItem } from "../../../models/IReportItem";

export interface IReportProps {
  key: number;
  reportItem: IReportBasicItem;
  siteUrl:string;
}


export default class ReportVerticle extends React.Component<IReportProps, {}> {

  public render(): React.ReactElement<IReportProps> {
    const reportURL = this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + this.props.reportItem.Id;
    return (
      <div className={styles.reportVerticle}>
        <div className={styles.wrapper}>
          <img src={this.props.reportItem.SVPVisualizationImage} className={styles.image} />
          <a href={reportURL} className={styles.url} >
            <h4 className={styles.title}>{this.props.reportItem.Title}</h4>
          </a>
          <p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
        </div>
      </div>
    );
  }
}
