import * as React from 'react';
import styles from './ReportHorizontal.module.scss';
import { IReportItem } from "../../../models/IReportItem";

export interface IReportProps {
  key: number;
  reportItem: IReportItem;
}


export default class ReportHorizontal extends React.Component<IReportProps, {}> {

  public render(): React.ReactElement<IReportProps> {
    const rowStyle = {
      display: 'inline-flex',
    };

    const colStyle = {
      background: '#EEF0F2',
    };

    return (
      <div className={styles.reportHorizontal}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-md-6">
              <img src={this.props.reportItem.imageUrl} className={styles.image} />
            </div>
            <div className="col-md-6" style={colStyle}>
              <a href="#" className={styles.url}>
                <h4 className={styles.title}>{this.props.reportItem.title}</h4>
              </a>  
              <p className={styles.description}>{this.props.reportItem.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
