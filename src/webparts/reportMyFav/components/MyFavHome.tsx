import * as React from 'react';
import styles from './MyFavHome.module.scss';

// Third Party
import { ActionButton, Link } from 'office-ui-fabric-react';

// Interface
import { IReportFavoriteItem } from "../../../models/IReportItem";

export interface IReportProps {
  key: string;
  reportItem: IReportFavoriteItem;
  siteURL:string;

  onView(favReport:IReportFavoriteItem);
  onShare(favReport:IReportFavoriteItem);
  onRemove(favReport:IReportFavoriteItem);
}

/*
   My Favorites on the home page
*/

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
                  <ActionButton data-automation-id="HeartFill" iconProps={{ iconName: 'HeartFill' }} allowDisabledFocus={true} title="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)} >Favorite</ActionButton>
                  <ActionButton data-automation-id="Share" iconProps={{ iconName: 'Share' }} allowDisabledFocus={true} title="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)} >Share</ActionButton>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
   }
}
