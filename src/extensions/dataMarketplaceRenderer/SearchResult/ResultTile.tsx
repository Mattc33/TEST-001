import * as React from 'react';
import styles from './SearchResult.module.scss';
import resultTileStyles from './ResultTile.module.scss';

// Third Party
import * as moment from 'moment';
import { TooltipHost, getId, Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, autobind, TextField, Spinner, SpinnerSize, ActionButton } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';
import { truncate } from '@microsoft/sp-lodash-subset';

// Interface
import IResultTileProps from './IResultTileProps';
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
  favoriteTitle: string;
}

interface IMetaDataTag {
  InternalName: string;
  DisplayName: string;
  DisplayValue: string;
}

interface IMetaDataTags extends Array<IMetaDataTag>{}

export default class ResultTile extends React.Component<IResultTileProps, IResultTileState> {
  private actionsService: ReportActionsService;
  private busyElement: JSX.Element = <Spinner size={SpinnerSize.small} />; // <i className="ms-Spinner-circle ms-Spinner--xSmall circle-95"></i>;
  private descTooltipId: string;
  private titleTooltipId: string;

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
      title="Remove report from favorite list" 
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
      title="Add report to favorite list" 
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
      <i className={"ms-Icon ms-Icon--Like" + this.unselectedStyle} aria-hidden="true"></i>&nbsp;
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
      favoriteDescription: this.props.result.SVPVisualizationDescription,
      favoriteTitle: this.props.result.Title
    };

    this.descTooltipId = getId('svpDesc');
    this.titleTooltipId = getId('svpTitle');
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

    const reportURL: string = (this.state.isFavorite)
      ? `${this.props.result.SPWebUrl}/SitePages/ViewReport.aspx?favReportId=${this.state.favoriteId}`
      : `${this.props.result.SPWebUrl}/SitePages/ViewReport.aspx?reportId=${result.ListItemId}`;

    const reportTitle: string = truncate(result.Title, { 'length': 45, 'separator': ' ' });
    const reportOwner: string = result.SVPVisualizationOwner;
    const reportLastUpdated: string = moment(result.Created).format('llll');
    const reportThumbnail: string = result.SVPVisualizationImage;
    const reportDesc: string = truncate(result.SVPVisualizationDescription, { 'length': 80, 'separator': ' ' });
    /*
      Suggestion: once metadata is properly defined by the client have them be delivered inside another array of objects 
      called `MetaDataTags` or something. This way there is no hardcoded mapping.
    */
    const reportMetaDataTags: IMetaDataTags = [
      {
         'InternalName': 'SVPBusinessUnit',
         'DisplayName': 'Business Unit',
         'DisplayValue': result.SVPBusinessUnit
      },
      {
         'InternalName': 'SVPDepartment',
         'DisplayName': 'Department',
         'DisplayValue': result.SVPDepartment
      },
      {
         'InternalName': 'SVPMetadata1',
         'DisplayName': 'Purpose',
         'DisplayValue': result.SVPMetadata1
      },
      {
         'InternalName': 'SVPMetadata2',
         'DisplayName': 'Process',
         'DisplayValue': result.SVPMetadata2
      },
      {
         'InternalName': 'SVPMetadata3',
         'DisplayName': 'Area',
         'DisplayValue': result.SVPMetadata3
      },
      {
         'InternalName': 'SVPMetadata4',
         'DisplayName': 'Role',
         'DisplayValue': result.SVPMetadata4
      }
    ];

    const metaDataTags: JSX.Element[] = reportMetaDataTags.map((eaMetaDataTag: IMetaDataTag) => {
      const { InternalName, DisplayName, DisplayValue } = eaMetaDataTag; // obj destructuring
      if (DisplayValue) {
        return <div className={resultTileStyles['Tile-MetaTag']}>{DisplayValue}</div>;
      } else {
        return null;
      }
    });
    
    return (
      <li className={resultTileStyles['Tile-Container']} >
        <header className={resultTileStyles['Tile-Header']}>
          <div className={resultTileStyles['Tile-Title-Container']}>
            <div className={resultTileStyles['Tile-Header-Title']}>
              <a href={reportURL}>
                {reportTitle}
              </a>
            </div>
            <div className={resultTileStyles['Tile-Header-Owner']}>
              Owner: 
              { 
                (reportOwner)
                    ? <span> {reportOwner}</span>
                    : <span> No Owner Found</span>
              }
            </div>
            <div className={resultTileStyles['Tile-Header-LastUpdated']}>
              Last Updated: 
              {
               (reportLastUpdated)
                  ? <span>{reportLastUpdated}</span>
                  : <span>{'Insert blank last updated text here'}</span>
              }
            </div>
          </div>
          <aside className={resultTileStyles['Tile-Header-Interactable-Icons-Container']}>
            <div className={resultTileStyles['Tile-Header-Favorite-Icon']}>
              <span>
                { this.state.busyFavoriting && this.busyElement }
                { !this.state.busyFavoriting && this.state.isFavorite && this.isFavoriteIconElement }
                { !this.state.busyFavoriting && !this.state.isFavorite && this.isNotFavoriteIconElement }
              </span>
            </div>
            <div className={resultTileStyles['Tile-Header-Share-Icon']}>
              { this.shareIconElement }
            </div>
            <div className={resultTileStyles['Tile-Header-Like-Icon']}>
              { hideLike && 
                <span>
                  { this.state.busyLiking && this.busyElement }
                  { !this.state.busyLiking && this.state.isLiked && this.isLikedIconElement }
                  { !this.state.busyLiking && !this.state.isLiked && this.isNotLikedIconElement }
                </span>
              }
            </div>
          </aside>
        </header>

        <section className={resultTileStyles['Tile-Content']}>
          <aside className={resultTileStyles['Tile-Content-Thumbnail']}>
            <a href={reportURL}>
              <img src={reportThumbnail} alt="" />
            </a>
          </aside>
          <aside className={resultTileStyles['Tile-Content-Info']}>
            <p className={resultTileStyles['Tile-Content-Description']}>
              {reportDesc}
            </p>
            <div className={resultTileStyles['Tile-Content-Metatags']}>
              {metaDataTags}
            </div>
          </aside>
        </section>        
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
    const subText = (!this.state.busyFavoriting)
      ? "Enter a custom report title and description." 
      : "";

    return (
      <Dialog
        hidden={this.state.favoriteDialogHidden}
        onDismiss={this.favoriteDialogCanceled}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Save Favorite',
          subText: subText //'Enter a custom description. Only you will see this description. Others will see the default description for the visualization.'
        }}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}>

        { !this.state.busyFavoriting && 
          <React.Fragment>
            <div><strong>Title:</strong></div>
              <TextField placeholder="Enter custom title..."
                ariaLabel="Please enter text here" multiline rows={3}
                value={this.state.favoriteTitle} onChanged={this.onFavoriteTitleChanged} />

            <br />

            <div><strong>Description:</strong></div>
            <TextField placeholder="Enter custom description..."
              ariaLabel="Please enter text here" multiline rows={4}
              value={this.state.favoriteDescription} onChanged={this.onFavoriteDescriptionChanged} />
          </React.Fragment>
        }

        { this.state.busyFavoriting && 
          <Spinner size={SpinnerSize.large} label="Saving report in favorite list, wait..." ariaLive="assertive" />
        }

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
      this.props.result.SPWebUrl, 
      itemId, 
      this.state.favoriteDescription || "",
      undefined,
      undefined,
      undefined,
      this.state.favoriteTitle || undefined);

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
      favoriteDialogHidden: false,
      favoriteDescription: this.props.result.SVPVisualizationDescription,
      favoriteTitle: this.props.result.Title
    });
  }

  @autobind
  private onFavoriteDescriptionChanged(newValue: string) {
    this.setState({
      favoriteDescription: newValue || ""
    });
  }

  @autobind
  private onFavoriteTitleChanged(newValue: string) {
    this.setState({
      favoriteTitle: newValue || ""
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