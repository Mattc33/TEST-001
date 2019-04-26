import * as React from 'react';
import * as moment from 'moment';
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, autobind, TextField, Spinner, SpinnerSize, SpinnerType } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';

import IResultTileProps from './IResultTileProps';
import styles from './SearchResult.module.scss';
import { ISearchResult } from '../../../models/ISearchResult';
import { ReportActionsService } from '../../../services/ReportActionsService/ReportActionsService';

export interface IResultTileState {
  isFavorite: boolean;
  busyFavoriting: boolean;
  isLiked: boolean;
  busyLiking: boolean;
  favoriteDialogHidden: boolean;
  favoriteDescription: string;
}

export default class ResultTile extends React.Component<IResultTileProps, IResultTileState> {
  private actionsService: ReportActionsService;
  private busyElement: JSX.Element = <Spinner size={SpinnerSize.small} />; // <i className="ms-Spinner-circle ms-Spinner--xSmall circle-95"></i>;

  constructor(props: IResultTileProps) {
    super(props);

    this.state = {
      isFavorite: false,
      busyFavoriting: false,
      isLiked: false,
      busyLiking: false,
      favoriteDialogHidden: true,
      favoriteDescription: this.props.result.SVPVisualizationDescription
    };
    this.actionsService = new ReportActionsService();
  }

  public async componentDidMount() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let [isFavorite, isLiked] = await Promise.all([
      this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId),
      this.actionsService.GetLikeState(this.props.result.SPWebUrl, itemId, this.props.currentUser.Id)
    ]);

    this.setState({
      isFavorite: isFavorite,
      isLiked: isLiked
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
      <i className="ms-Icon ms-Icon--Heart" aria-hidden="true" onClick={this.showFavoriteDialog}></i>
    );

    let isLikedIconElement: JSX.Element = (
      <i className={"ms-Icon ms-Icon--LikeSolid " + styles.linkItem} aria-hidden="true" onClick={this.removeLike}></i>
    );

    let isNotLikedIconElement: JSX.Element = (
      <i className={"ms-Icon ms-Icon--Like " + styles.linkItem} aria-hidden="true" onClick={this.addLike}></i>
    );

    return (
      <li className={styles.resultItem}>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg4 tile-class">
          <div className="singleCard">
            <div className="previewImg" style={{ backgroundImage: `url(${result.SVPVisualizationImage})` }}>
              &nbsp;
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
                  <div className={styles.likeFavContainer}>
                    <span>
                      { this.state.busyFavoriting && this.busyElement }
                      { !this.state.busyFavoriting && this.state.isFavorite && isFavoriteIconElement }
                      { !this.state.busyFavoriting && !this.state.isFavorite && isNotFavoriteIconElement }
                    </span>
                    <span>
                      &nbsp;&nbsp;
                    </span>
                    <span>
                      { this.state.busyLiking && this.busyElement }
                      { !this.state.busyLiking && this.state.isLiked && isLikedIconElement }
                      { !this.state.busyLiking && !this.state.isLiked && isNotLikedIconElement }
                    </span>
                  </div>
                </span>

                <div className="ms-ListItem-selectionTarget"></div>
              </div>
            </li>
          </div>
        </div>
        {this.renderFavoriteDialog()}
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

    toReturn = <img className={"cardFileIcon" + styles.visualizationTechnologyIcon} src={imageUrl} />;
    return toReturn;
  }

  private renderFavoriteDialog(): JSX.Element {
    return (
      <Dialog
        hidden={this.state.favoriteDialogHidden}
        onDismiss={this.favoriteDialogCanceled}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Save Favorite',
          subText: 'Enter a custom description. Only you will see this description. Others will see the default description for the visualization.'
        }}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}>
        <TextField placeholder="Enter custom description..."
          ariaLabel="Please enter text here" multiline rows={4}
          value={this.state.favoriteDescription} onChanged={this.onFavoriteDescriptionChanged} />

        <DialogFooter>
          <PrimaryButton onClick={this.favoriteDialogSaved} text="Save" />
          <DefaultButton onClick={this.favoriteDialogCanceled} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );
  }

  private fmtDateString(utcString) {
    return moment(utcString).fromNow();
  }

  private async getFavoriteState() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let isFavorited: boolean = await this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId);

    if (isFavorited) {
      this.setState({ isFavorite: true });
    }
  }

  @autobind
  private async addLike() {
    this.setState({ busyLiking: true });
    const itemId: number = parseInt(this.props.result.ListItemId);
    const success: boolean = await this.actionsService.AddLike(
      this.props.result.SPWebUrl,
      itemId,
      this.props.currentUser.Id
    );

    const state = (success) 
      ? { ...this.state, isLiked: true, busyLiking: false }
      : { ...this.state, busyLiking: false };
    
    this.setState(state);
  }

  @autobind
  private async removeLike() {
    this.setState({ busyLiking: true });
    let itemId: number = parseInt(this.props.result.ListItemId);
    const success: boolean = await this.actionsService.RemoveLike(
      this.props.result.SPWebUrl,
      itemId,
      this.props.currentUser.Id
    );

    const state = (success) 
      ? { ...this.state, isLiked: false, busyLiking: false }
      : { ...this.state, busyLiking: false };
    
    this.setState(state);
  }

  @autobind
  private async favorite() {
    this.setState({ busyFavoriting: true});
    let itemId: number = parseInt(this.props.result.ListItemId);
    let success: boolean = await this.actionsService.FavoriteReport(
      this.props.result.SPWebUrl, itemId, this.state.favoriteDescription || "");

    const state = (success) 
      ? { ...this.state, isFavorite: true, busyFavoriting: false }
      : { ...this.state, busyFavoriting: false };

    this.setState(state);
  }

  @autobind
  private async unfavorite() {
    this.setState({ busyFavoriting: true});
    let itemId: number = parseInt(this.props.result.ListItemId);
    let successItem: any = {};
    try {
      await this.actionsService.UnfavoriteReport(this.props.result.SPWebUrl, itemId);

      successItem = { isFavorite: false };

      // this.setState({
      //   isFavorite: false,
      //   busyFavoriting: false
      // });
    } catch (ex) {
      console.log(`Couldn't unfavorite item ${itemId}.`);
    }
    finally {
      const state = { ...this.state, ...successItem, busyFavoriting: false };
      this.setState(state);
    }
  }

  @autobind
  private showFavoriteDialog() {
    this.setState({
      favoriteDialogHidden: false
    });
  }

  @autobind
  private onFavoriteDescriptionChanged(newValue: string) {
    this.setState({
      favoriteDescription: newValue || ""
    });
  }

  @autobind
  private async favoriteDialogCanceled() {
    Logger.write("Closed the favorite dialog.", LogLevel.Verbose);
    this.setState({
      favoriteDialogHidden: true
    });
  }

  @autobind
  private async favoriteDialogSaved() {
    Logger.write(`Saved ${this.state.favoriteDescription} from the favorite dialog.`, LogLevel.Verbose);
    await this.favorite();
    this.setState({
      favoriteDialogHidden: true
    });
  }
}