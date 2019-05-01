import * as React from 'react';
import styles from './MyFavAllWithImage.module.scss';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { ReportFavoriteType } from "../../../helpers/UrlHelper";
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


export default class MyFavAllWithImage extends React.Component<IReportProps, {}> {

  

  public render(): React.ReactElement<IReportProps> {
    const reportTitle = this.props.reportItem.Title;
    const reportDesc = this.props.reportItem.SVPVisualizationDescription;
    const favReportViewUrl = this.props.siteURL + "/SitePages/ViewReport.aspx?favReportId=" + this.props.reportItem.Id;



    let reportImageUrl = this.props.reportItem.SVPVisualizationImage;
    if(this.props.reportItem.SVPFavoriteType != ReportFavoriteType.Original) {
      //TODO: Get the URL from SVPVisualizationMetadata:
      reportImageUrl = "#";
    }

    return (
      <li className={styles.resultItem}>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg4 tile-class">
          <div className="singleCard">
            
            <li className="ms-ListItem ms-ListItem--document">
              <div className={"cardInfo" + styles.featuredCard}>
                <span className="ms-ListItem-primaryText">
                  <a className={styles.itemLink} href={favReportViewUrl}>
                    <span className={styles.itemTitle}>{reportTitle}</span>
                  </a>
                </span>

                <div className="datamkt-sub">

                <div className="previewImg datamkt-left" style={{ backgroundImage: `url(${reportImageUrl})` }}>
                    &nbsp;
                  </div>
                  <div className="datamkt-right">
                <span className="ms-ListItem-secondaryText">{reportDesc}</span>
                </div>
                </div>
                <span className={styles.likeFaveButtons}>
                  <div className={styles.likeFavContainer}>
                    <span>
                    <IconButton iconProps={{ iconName: 'HeartFill' }} title="Remove Report" ariaLabel="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)}/>Favorite
                    <IconButton iconProps={{ iconName: 'Share' }} title="Share Report" ariaLabel="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)}/>Like
                    </span>
                  </div>
                </span>

                <div className="ms-ListItem-selectionTarget"></div>
              </div>
            </li>
          </div>
        </div>
      </li>
    );
  }
//TODO
//<p className={styles.description}>{this.props.reportItem.SVPVisualizationDescription}</p>
////<button className={styles.button} type="button" onClick={(e) => this.props.onView(this.props.reportItem.Id)}>View</button>
//<Link  className={styles.button} href={ favReportViewUrl } target="_self">View </Link>

}
