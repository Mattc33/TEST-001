import * as React from 'react';
import * as moment from 'moment';
import { TooltipHost, getId, Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, autobind, TextField, Spinner, SpinnerSize, ActionButton } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';
import { truncate } from '@microsoft/sp-lodash-subset';
import IResultTileProps from './IResultTileProps';
import styles from './SearchResult.module.scss';
import { ISearchResult } from '../../../models/ISearchResult';
import { ReportActionsService, IFavoriteState } from '../../../services/ReportActionsService/ReportActionsService';

export interface IResultTileState {
  isFavorite: boolean;
  favoriteId: number;
  busyFavoriting: boolean;
  isLiked: boolean;
  busyLiking: boolean;
  favoriteDialogHidden: boolean;
  favoriteDescription: string;
}

export default class ResultTile extends React.Component<IResultTileProps, IResultTileState> {
  private actionsService: ReportActionsService;
  private busyElement: JSX.Element = <Spinner size={SpinnerSize.small} />; // <i className="ms-Spinner-circle ms-Spinner--xSmall circle-95"></i>;
  private tooltipId: string;

  private selectedStyle = ` ${styles.linkItem} ${styles.itemSelected}`;
  private unselectedStyle = ` ${styles.linkItem} ${styles.itemUnselected}`;

  // <ActionButton data-automation-id="HeartFill" iconProps={{ iconName: 'HeartFill' }} allowDisabledFocus={true} title="Remove Report" onClick={(e) => this.props.onRemove(this.props.reportItem)} >Favorite</ActionButton>
  // <ActionButton data-automation-id="Share" iconProps={{ iconName: 'Share' }} allowDisabledFocus={true} title="Share Report" onClick={(e) => this.props.onShare(this.props.reportItem)} >Share</ActionButton>

  private isFavoriteIconElement: JSX.Element = (
    <ActionButton 
      className={this.selectedStyle} 
      data-automation-id="HeartFill" 
      iconProps={{ iconName: 'HeartFill' }} 
      allowDisabledFocus={true} 
      title="Add report to favorite list" 
      onClick={this.unfavorite}>
        Favorite
    </ActionButton>
  );

  private isNotFavoriteIconElement: JSX.Element = (
    <ActionButton 
      className={this.unselectedStyle} 
      data-automation-id="HeartFill" 
      iconProps={{ iconName: 'HeartFill' }} 
      allowDisabledFocus={true} 
      title="Remove report from favorite list" 
      onClick={this.showFavoriteDialog}>
        Favorite
    </ActionButton>
  );

  private shareIconElement: JSX.Element = (
    <ActionButton 
      className={this.selectedStyle} 
      data-automation-id="Share" 
      iconProps={{ iconName: 'Share' }} 
      allowDisabledFocus={true} 
      title="Share Report" 
      onClick={this.shareReport}>
        Share
    </ActionButton>
  );

  private isLikedIconElement: JSX.Element = (
    <span onClick={this.removeLike}>
      <i className={"ms-Icon ms-Icon--LikeSolid" + this.selectedStyle} aria-hidden="true"></i>&nbsp;
      <span className={styles.itemSelected}>Like</span>
    </span>
  );

  private isNotLikedIconElement: JSX.Element = (
    <span onClick={this.addLike}>
      <i className={"ms-Icon ms-Icon--LikeSolid" + this.unselectedStyle} aria-hidden="true"></i>&nbsp;
      <span className={styles.itemUnselected}>Like</span>
    </span>
  );

  constructor(props: IResultTileProps) {
    super(props);

    this.state = {
      isFavorite: false,
      favoriteId: -1,
      busyFavoriting: false,
      isLiked: false,
      busyLiking: false,
      favoriteDialogHidden: true,
      favoriteDescription: this.props.result.SVPVisualizationDescription
    };

    this.tooltipId = getId('svpDesc');
    this.actionsService = new ReportActionsService();
  }

  @autobind
  public async componentDidMount() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let [favorite, isLiked] = await Promise.all([
      this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId),
      this.actionsService.GetLikeState(this.props.result.SPWebUrl, itemId, this.props.currentUser.Id)
    ]);

    this.setState({
      isFavorite: favorite.isFavorite,
      favoriteId: favorite.favoriteId,
      isLiked: isLiked
    });
  }

  @autobind
  public render() {
    return this.renderResultItem(this.props.result);
  }

  @autobind
  private renderResultItem(result: ISearchResult): JSX.Element {

    const hideLike: boolean = true;

    const reportURL = (this.state.isFavorite)
      ? `${this.props.result.SPWebUrl}/SitePages/ViewReport.aspx?favReportId=${this.state.favoriteId}`
      : `${this.props.result.SPWebUrl}/SitePages/ViewReport.aspx?reportId=${result.ListItemId}`;

    const reportDesc = truncate(result.SVPVisualizationDescription, { 'length': 80, 'separator': ' ' });

    return (
      <li className={styles.resultItem}>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg4 tile-class">
          <div className="singleCard">
            
            <li className="ms-ListItem ms-ListItem--document">
              <div className={"cardInfo" + result.SVPIsFeatured ? styles.featuredCard : ""}>
                <span className="ms-ListItem-primaryText">
                  <a className={styles.itemLink} href={reportURL}>
                    <span className={styles.itemTitle}>{result.Title}</span>
                  </a>
                </span>
                <div className="datamkt-sub">
                  <div className="previewImg datamkt-left" style={{ backgroundImage: `url(${result.SVPVisualizationImage})` }}>
                    &nbsp;
                  </div>
                  <div className="datamkt-right">
                    <TooltipHost content={result.SVPVisualizationDescription} id={this.tooltipId} calloutProps={{ gapSpace: 0 }}>
                      <span className="ms-ListItem-secondaryText">{reportDesc}</span>
                    </TooltipHost>
                    <span className="ms-ListItem-tertiaryText">{this.fmtDateString(result.Created)}</span>
                  </div>
                </div>
                <div className="datamkt-icons">
                  <span className={styles.likeFaveButtons}>
                    <div className={styles.likeFavContainer}>
                      <span>
                        { this.state.busyFavoriting && this.busyElement }
                        { !this.state.busyFavoriting && this.state.isFavorite && this.isFavoriteIconElement }
                        { !this.state.busyFavoriting && !this.state.isFavorite && this.isNotFavoriteIconElement }
                      </span>
                      <span>
                        { this.shareIconElement }
                      </span>
                      { !hideLike && 
                        <span>
                          { this.state.busyLiking && this.busyElement }
                          { !this.state.busyLiking && this.state.isLiked && this.isLikedIconElement }
                          { !this.state.busyLiking && !this.state.isLiked && this.isNotLikedIconElement }
                        </span>
                      }
                    </div>
                  </span>
                </div>
                <div className="ms-ListItem-selectionTarget"></div>
              </div>
            </li>
          </div>
        </div>
        {this.renderFavoriteDialog()}
      </li>
    );
  }

  @autobind
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

  @autobind
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

  @autobind
  private fmtDateString(utcString) {
    return moment(utcString).fromNow();
  }

  @autobind
  private async getFavoriteState() {
    let itemId: number = parseInt(this.props.result.ListItemId);
    let favorited: IFavoriteState = await this.actionsService.GetFavoriteState(this.props.result.SPWebUrl, itemId);

    if (favorited && favorited.isFavorite) {
      this.setState({ isFavorite: true });
    }
  }

  @autobind
  private async shareReport() {
    const result: ISearchResult = this.props.result;
    const reportURL = `${this.props.result.SPWebUrl}/SitePages/ViewReport.aspx?reportId=${result.ListItemId}`;

    const personName = this.props.currentUser.Title;
    const subject = `${personName} shared a report: ${result.Title}`;
    window.location.href = `mailto:?subject=${subject}&body=%0d%0a%0d%0a${reportURL}%0d%0a%0d%0a${result.SVPVisualizationDescription}`;
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
    let favorite: IFavoriteState = await this.actionsService.FavoriteReport(
      this.props.result.SPWebUrl, itemId, this.state.favoriteDescription || "");

    const state = (favorite && favorite.isFavorite) 
      ? { ...this.state, isFavorite: true, favoriteId: favorite.favoriteId, busyFavoriting: false }
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