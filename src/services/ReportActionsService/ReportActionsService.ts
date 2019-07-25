import { sp, ItemAddResult, ItemUpdateResult, Item, Web, Items } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';

import { CurrentUser } from '@pnp/sp/src/siteusers';
import { create } from 'handlebars';

export interface IFavoriteState {
  isFavorite: boolean;
  favoriteId?: number;
}

export class FavoriteType {
  public static ORIGINAL: string = "Original";
  public static CUSTOM: string = "Custom";
  public static PARAMETERIZED: string = "Parameterized";
}

const FAVORITES_LIST_TITLE: string = "Favorites";
const VISUALIZATIONS_LIST_TITLE: string = "Visualizations";
const VISUALIZATIONS_EXTENSION_LIST_TITLE: string = "Visualizations Extension";

export class ReportActionsService {
  public async FavoriteReport(webUrl: string, reportId: number, description?: string, favoriteType?: FavoriteType, parametersId?: Array<number>,
    metadata?: string, reportTitle?: string): Promise<IFavoriteState> {
    let web: Web = await new Web(webUrl);
    let report: any = await web.lists.getByTitle(VISUALIZATIONS_LIST_TITLE).items.getById(reportId).fieldValuesAsText.get();

    let favoriteObject: any = {
      Title: reportTitle || report.Title,
      SVPVisualizationLookupId: reportId,
      SVPVisualizationDescription: description || report.SVPVisualizationDescription,
      SVPFavoriteType: favoriteType || FavoriteType.ORIGINAL,
      SVPVisualizationMetadata: metadata || ""
    };

    if (parametersId) {
      favoriteObject.SVPVisualizationParametersId = parametersId;
    }

    let favedInfo: ItemAddResult = await web.lists.getByTitle(FAVORITES_LIST_TITLE).items
      .add(favoriteObject);

    if (favedInfo.item) {
      Logger.write(`Favorited report with id #${reportId}`, LogLevel.Info);
      return { isFavorite: true, favoriteId: favedInfo.data.Id };
    } else {
      Logger.error(new Error("Favoriting report with id #${reportId} failed."));
      return { isFavorite: false, favoriteId: -1 };
    }
  }

  public async GetFavoriteState(webUrl: string, reportId: number): Promise<IFavoriteState> {
    let web: Web = await new Web(webUrl);
    let currentUser: any = await web.currentUser.get();
    let favoriteItem: Item[] = await web.lists.getByTitle(FAVORITES_LIST_TITLE).items
      .select("*", "SVPVisualizationLookupId", "Author/Id")
      .expand("Author")
      .filter(`SVPVisualizationLookupId eq ${reportId} and Author/Id eq ${currentUser.Id}`)
      .get();

    return (favoriteItem.length > 0) 
      ? { isFavorite: true, favoriteId: (favoriteItem[0] as any).Id }
      : { isFavorite: false, favoriteId: -1 };
  }

  public async UnfavoriteReport(webUrl: string, reportId: number): Promise<void> {
    let web: Web = await new Web(webUrl);
    let currentUser: any = await web.currentUser.get();
    let favoriteItem: any[] = await web.lists.getByTitle(FAVORITES_LIST_TITLE).items
      .select("*", "SVPVisualizationLookupId", "Author/Id")
      .expand("Author")
      .filter(`SVPVisualizationLookupId eq ${reportId} and Author/Id eq ${currentUser.Id}`)
      .get();

    if (favoriteItem && (favoriteItem.length > 0)) {
      await web.lists.getByTitle(FAVORITES_LIST_TITLE).items.getById(favoriteItem[0].Id).delete();
    }
  }

  public async GetLikeState(webUrl: string, reportId: number, userId: number): Promise<boolean> {
    const userIdStr = userId.toString();
    const likes = await this.getLikes(webUrl, reportId);
    if (likes && likes.length > 0) {
      return (likes
        .split(",")
        .findIndex((s: string) => s === userIdStr) !== -1);
    }

    return false;
  }

  public async AddLike(webUrl: string, reportId: number, userId: number): Promise<boolean> {
    const rawLikes = await this.getLikes(webUrl, reportId);
    const likes = rawLikes
      .split(",")
      .concat(userId.toString())
      .join(",");
    const rawViews = await this.getAllViews(webUrl, reportId);  
    const result = await this.saveLikes(webUrl, reportId, likes, rawViews);

    return (result.item) ? true : false;
  }

  public async RemoveLike(webUrl: string, reportId: number, userId: number): Promise<boolean> {
    const userIdStr = userId.toString();
    const rawLikes = await this.getLikes(webUrl, reportId);
    const likes = rawLikes
      .split(",")
      .filter((s: string) => s !== userIdStr)
      .join(",");
    const rawViews = await this.getAllViews(webUrl, reportId);
    const result = await this.saveLikes(webUrl, reportId, likes , rawViews) ;

    return (result.item) ? true : false;
  }
 
  public async AddView(webUrl: string, reportId: number): Promise<boolean> {
    let web: Web = await new Web(webUrl);
    let currentUser: any = await web.currentUser.get();
    const rawLikes = await this.getLikes(webUrl, reportId);
    const rawViews = await this.getAllViews(webUrl, reportId);
    const views = rawViews
      .split(",")
      .concat(currentUser.Id.toString())
      .join(",");  
    const result = await this.saveLikes(webUrl, reportId, rawLikes, views);

    return (result.item) ? true : false;
  }

  private async saveLikes(webUrl: string, reportId: number, likes: string, views:string): Promise<ItemUpdateResult|ItemAddResult> {
    let web: Web = await new Web(webUrl);
    let likeItem: Item = await this.getLikesItem(webUrl, reportId);
    let result: ItemUpdateResult|ItemAddResult;
    let cleanLikes = (likes && likes[0] === ",") ? likes.substring(1) : likes;
    let cleanViews = (views && views[0] === ",") ? views.substring(1) : views;

    if (likeItem) { //update
      const likeItemId: number = likeItem["Id"] as number;
      result = await web.lists.getByTitle(VISUALIZATIONS_EXTENSION_LIST_TITLE).items
        .getById(likeItemId)
        .update({
          "Title": `Likes Count: ${(cleanLikes && cleanLikes.length > 0) ? cleanLikes.split(",").length : 0}| Views Count: ${(cleanViews && cleanViews.length > 0) ? cleanViews.split(",").length : 0}`,
          "SVPLikes": cleanLikes,
          "SVPViews": cleanViews
        });
    }
    else { //add
      let likeObject: any = {
        "Title": `Likes Count: ${(cleanLikes && cleanLikes.length > 0) ? cleanLikes.split(",").length : 0}| Views Count: ${(cleanViews && cleanViews.length > 0) ? cleanViews.split(",").length : 0}`,
        "SVPVisualizationLookupId": reportId,
        "SVPLikes": cleanLikes,
        "SVPViews": cleanViews
      };
  
      result = await web.lists.getByTitle(VISUALIZATIONS_EXTENSION_LIST_TITLE).items
        .add(likeObject);
    }

    return result;

    // return web.lists.getByTitle(VISUALIZATIONS_LIST_TITLE).items
    //   .getById(reportId)
    //   .update({
    //     "SVPLikes": likes
    //   });
  }

  private async getLikes(webUrl: string, reportId: number): Promise<string> {
    let web: Web = await new Web(webUrl);
    let likeItem: Item = await this.getLikesItem(webUrl, reportId);

    return (likeItem && likeItem["SVPLikes"])
      ? (likeItem["SVPLikes"] as string)
      : '';

    // let reportItem: Item = await web.lists.getByTitle(VISUALIZATIONS_LIST_TITLE).items
    //   .getById(reportId)
    //   .select("SVPLikes")
    //   .get();

    // return (reportItem && reportItem["SVPLikes"])
    //   ? (reportItem["SVPLikes"] as string)
    //   : '';
  }

  private async getAllViews(webUrl: string, reportId: number): Promise<string> {
    let web: Web = await new Web(webUrl);
    let viewItem: Item = await this.getLikesItem(webUrl, reportId);

    return (viewItem && viewItem["SVPViews"])
      ? (viewItem["SVPViews"] as string)
      : '';
  }

  private async getLikesItem(webUrl: string, reportId: number): Promise<Item> {
    let web: Web = await new Web(webUrl);
    let likeItems: Item[] = await web.lists.getByTitle(VISUALIZATIONS_EXTENSION_LIST_TITLE).items
      .select("Id", "SVPLikes", "SVPVisualizationLookupId","SVPViews")
      .filter(`SVPVisualizationLookupId eq ${reportId}`)
      .get();

    return (likeItems && likeItems.length > 0 )
      ? likeItems[0]
      : null;
  }

  public async getReportLikeCount(webUrl: string, reportId: number): Promise<string> {
    let web: Web = await new Web(webUrl);
    let likeItems: string = await web.lists.getByTitle(VISUALIZATIONS_EXTENSION_LIST_TITLE).items
      .select("Title")
      .filter(`SVPVisualizationLookupId eq ${reportId}`)
      .get();

    return (likeItems && likeItems.length > 0 )
      ? likeItems[0]["Title"]
      : null;
  }


  public async getReportId(webUrl: string, favoriteId: number)
  : Promise<number> {
    let web: Web = await new Web(webUrl);
    let items: string = await web.lists.getByTitle(FAVORITES_LIST_TITLE).items
      .select("SVPVisualizationLookupId")
      .filter(`Id eq ${favoriteId}`)
      .get();
    return (items && items.length > 0 )
      ? items[0]["SVPVisualizationLookupId"]
      : null;
  }
}