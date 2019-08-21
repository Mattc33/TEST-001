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
         <div>Hello</div>
      )
   }
}
