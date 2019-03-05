import * as React from 'react';
import IResultTileProps from './IResultTileProps';
import styles from './SearchResult.module.scss';
import { PersonaCoin } from 'office-ui-fabric-react/lib/PersonaCoin';
import * as moment from 'moment';
import { ISearchResult } from '../../../models/ISearchResult';
import { autobind } from '@uifabric/utilities';
import { ReportActionsService } from '../../../services/ReportActionsService/ReportActionsService';

export interface IResultTileState {
  isFavorite?: boolean;
}

export default class ResultTile extends React.Component<IResultTileProps, IResultTileState> {
  private actionsService: ReportActionsService;

  constructor(props: IResultTileProps) {
    super(props);

    this.state = {
      isFavorite: false
    };
    this.actionsService = new ReportActionsService();
  }

  public async componentDidMount() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let isFavorite: boolean = await this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId);

    this.setState({
      isFavorite: isFavorite
    });
  }

  public render() {
    return this.renderResultItem(this.props.result);
  }

  private renderResultItem(result: ISearchResult): JSX.Element {

    let isFavoriteIconElement: JSX.Element = (
      <i className="ms-Icon ms-Icon--HeartFill" aria-hidden="true" onClick={this.unfavorite}></i>
    );

    let isNotFavoriteIconElement: JSX.Element = (
      <i className="ms-Icon ms-Icon--Heart" aria-hidden="true" onClick={this.favorite}></i>
    );

    return (
      <li className={styles.resultItem}>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg4">
          <div className="singleCard">
            <div className="previewImg" style={{ backgroundImage: `url(${result.RefinableString04})` }}>
              {this.renderVizIconImage(result)}
            </div>
            <li className="ms-ListItem ms-ListItem--document">
              <div className={"cardInfo" + result.SVPIsFeatured ? styles.featuredCard : ""}>
                <span className="ms-ListItem-primaryText">
                  <a className={styles.itemLink} href={result.SVPVisualizationAddress}>
                    <span className={styles.itemTitle}>{result.Title}</span>
                  </a>
                </span>
                <span className="ms-ListItem-secondaryText">{result.SVPVisualizationDescription}</span>
                <span className="ms-ListItem-tertiaryText">{this.fmtDateString(result.Created)}</span>
                <span className={styles.likeFaveButtons}>
                  <span>
                    {this.state.isFavorite ? isFavoriteIconElement : isNotFavoriteIconElement}
                  </span>
                  {/* &nbsp;
                    <span>
                    <i className="ms-Icon ms-Icon--Like" aria-hidden="true" onClick={this.like}></i>
                  </span> */}
                </span>

                <div className="ms-ListItem-selectionTarget"></div>
              </div>
            </li>
          </div>
        </div>
      </li>
    );
  }

  private renderVizIconImage(result: ISearchResult) {
    let toReturn: JSX.Element;

    let imageUrl: string = this.props.result.SPWebUrl;

    switch (result.SVPVisualizationTechnology) {
      case "Tableau":
        imageUrl += "/SiteAssets/SlalomViewport/search/datamarketplace/icons/tableau.webp";
        break;
      case "QlikView":
        imageUrl += "/SiteAssets/SlalomViewport/search/datamarketplace/icons/qlik.webp";
        break;
      case "Power BI":
        imageUrl += "/SiteAssets/SlalomViewport/search/datamarketplace/icons/power-bi.webp";
        break;
      case "Excel":
        imageUrl += "/SiteAssets/SlalomViewport/search/datamarketplace/icons/excel.webp";
        break;
      case "PDF":
        imageUrl += "/SiteAssets/SlalomViewport/search/datamarketplace/icons/pdf.webp";
        break;
    }

    toReturn = <img className="cardFileIcon visualizationTechnologyIcon" src={imageUrl} />;
    return toReturn;
  }

  private async getFavoriteState() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let isFavorited: boolean = await this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId);

    if (isFavorited) {
      this.setState({ isFavorite: true });
    }
  }

  private fmtDateString(utcString) {
    return moment(utcString).fromNow();
  }

  @autobind
  private async favorite() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let success: boolean = await this.actionsService.FavoriteReport(this.props.result.SPWebUrl, itemId);

    if (success) {
      this.setState({
        isFavorite: true
      });
    }
  }

  @autobind
  private async unfavorite() {
    let itemId: number = parseInt(this.props.result.ListItemId);

    try {
      await this.actionsService.UnfavoriteReport(this.props.result.SPWebUrl, itemId);

      this.setState({
        isFavorite: false
      });
    } catch (ex) {
      console.log(`Couldn't unfavorite item ${itemId}.`);
    }
  }

  @autobind
  private like() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    this.actionsService.LikeReport(itemId);
  }
}