import * as React from 'react';
import styles from './MyFavHome.module.scss';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';

export interface IReportProps {
  key: string;
  reportItem: IReportFavoriteItem;
  siteURL:string;

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
      'width': '90%',
      'margin-bottom': '5px',
      'margin-top': '10px',
      'margin-left': '20px',
    };

    console.log("reportItem: ", this.props.reportItem);
    let reportTitle = this.props.reportItem.Title;
    const reportDesc = this.props.reportItem.SVPVisualizationDescription;
    const favReportViewUrl = this.props.siteURL + "/SitePages/ViewReport.aspx?favReportId=" + this.props.reportItem.Id;

    return (
      
      <div className={styles.MyFavHome}>
        <div className={styles.wrapper}>
       
          <div className="row">
            <div className="col-sm-12" style={colStyle}>
              <Link className={styles.FavReportTitle} href={ favReportViewUrl } target="_blank">{reportTitle}</Link>
            </div>
          </div>
          <div className="row" >
            <div className="col-sm-12" style={colStyle}>
              <span className={styles.description}>{reportDesc}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12" style={colStyle}>
              <span className={styles.socialIcons}> 
                  <IconButton iconProps={{ iconName: 'HeartFill' }} title="Remove Report" ariaLabel="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)}/>Favorite
                  <IconButton iconProps={{ iconName: 'Share' }} title="Share Report" ariaLabel="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)}/>Share
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
//TODO
//<IconButton iconProps={{ iconName: 'AreaChart' }} title="View Report" ariaLabel="View Report" onClick={(e) => this.props.onView(this.props.reportItem)}/>
//<p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
////<button className={styles.button} type="button" onClick={(e) => this.props.onView(this.props.reportItem.Id)}>View</button>
//<Link  className={styles.button} href={ favReportViewUrl } target="_self">View </Link>

}
