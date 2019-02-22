import * as React from 'react';
import styles from './Report.module.scss';
import { IReportItem } from "../../../models/IReportItem";

export interface IReportProps {
  key: number;
  reportItem: IReportItem;
}


export default class Report extends React.Component<IReportProps, {}> {

  public render(): React.ReactElement<IReportProps> {
    return (
      <div className={styles.report}>
        <div className={styles.wrapper}>
          <img src={this.props.reportItem.imageUrl} className={styles.image} />
          <a href="#" className={styles.url} >
            <h4 className={styles.title}>{this.props.reportItem.title}</h4>
          </a>
          <p className={styles.description}>{this.props.reportItem.description}</p>
        </div>
      </div>
    );
  }
}
