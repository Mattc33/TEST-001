import * as React from 'react';
import styles from './MyFavHome.module.scss';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { IconButton } from 'office-ui-fabric-react/lib/Button';


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
      margin: '1px 1px',
      width: '100%',
    };

    const colStyle = {
      width: '70%',
    };

    console.log("reportItem: ", this.props.reportItem);
    let reportTitle = this.props.reportItem.Title;
    const reportDesc = this.props.reportItem.SVPVisualizationDescription;

    return (
      <div className={styles.MyFavHome}>
        <div className={styles.wrapper}>
          <div className="row" style={rowStyle}>
            <div className="col-sm-8" style={colStyle}>
              <p className={styles.title}>{reportTitle}</p>
            </div>
            <div className="col-sm-4" >
                <p>
                  <IconButton iconProps={{ iconName: 'AreaChart' }} title="View Report" ariaLabel="View Report" onClick={(e) => this.props.onView(this.props.reportItem)}/>
                  <IconButton iconProps={{ iconName: 'Share' }} title="Share Report" ariaLabel="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)}/>
                  <IconButton iconProps={{ iconName: 'Cut' }} title="Remove Report" ariaLabel="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)}/>
                </p>
            </div>
          </div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-12">
              <p className={styles.description}>{reportDesc}</p>
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
