import * as React from 'react';
import styles from './MyFavAllWithImage.module.scss';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { ReportFavoriteType } from "../../../helpers/UrlHelper";
import { ActionButton } from 'office-ui-fabric-react/lib/Button';

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
      <li className={styles.MyFavAllWithImage}>
        <div className={"ms-Grid-col ms-sm12 ms-md6 ms-lg4 " + styles.tileClass}>
          <div className="singleCard">
            
            <li className="ms-ListItem ms-ListItem--document">
              <div className={"cardInfo" + styles.featuredCard}>
                <span className="ms-ListItem-primaryText">
                  <a className={styles.itemLink} href={favReportViewUrl}>
                    <span className={styles.itemTitle}>{reportTitle}</span>
                  </a>
                </span>

                <div className={styles.datamktSub}>

                  <div className={"previewImg" + styles.datamktLeft} style={{ backgroundImage: `url(${reportImageUrl})` }}>
                      &nbsp;
                  </div>
                  <div className={styles.datamktRight}>
                    <span className="ms-ListItem-secondaryText">{reportDesc}</span>
                  </div>
                </div>
                <div className={styles.likeFaveButtons}>
                  <span className={styles.likeFavContainer}>
                    <ActionButton data-automation-id="HeartFill" iconProps={{ iconName: 'HeartFill' }} allowDisabledFocus={true} title="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)} >Favorite</ActionButton>
                    <ActionButton data-automation-id="Share" iconProps={{ iconName: 'Share' }} allowDisabledFocus={true} title="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)} >Share</ActionButton>
                  </span>
                </div>
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
