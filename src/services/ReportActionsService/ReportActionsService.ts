import { sp, ItemAddResult, Item, Web, Items } from '@pnp/sp';
import { CurrentUser } from '@pnp/sp/src/siteusers';

export class FavoriteType {
  public static COMMON: string = "Common";
  public static CUSTOM: string = "Custom";
  public static PARAMETERIZED: string = "Parameterized";
}

export class ReportActionsService {

  public async GetReportLikeStatus(reportId: number) {
    let likedInfo: any = await sp.web.lists.getByTitle("Visualizations")
      .items.getById(reportId).getLikedByInformation();
  }

  public async LikeReport(reportId: number): Promise<void> {
    let likedInfo: any = await sp.web.lists.getByTitle("Visualizations")
      .items.getById(reportId).like();
    alert("Liked from the service!");
  }


  public async GetFavoriteState(webUrl: string, reportId: number): Promise<boolean> {
    let web: Web = await new Web(webUrl);
    let currentUser: any = await web.currentUser.get();
    let favoriteItem: Item[] = await web.lists.getByTitle("Favorites").items
      .select("*", "SVPVisualizationLookupId", "Author/Id")
      .expand("Author")
      .filter(`SVPVisualizationLookupId eq ${reportId} and Author/Id eq ${currentUser.Id}`)
      .get();

    return (favoriteItem.length > 0);
  }

  public async UnfavoriteReport(webUrl: string, reportId: number): Promise<void> {
    let web: Web = await new Web(webUrl);
    let currentUser: any = await web.currentUser.get();
    let favoriteItem: any[] = await web.lists.getByTitle("Favorites").items
      .select("*", "SVPVisualizationLookupId", "Author/Id")
      .expand("Author")
      .filter(`SVPVisualizationLookupId eq ${reportId} and Author/Id eq ${currentUser.Id}`)
      .get();

    if (favoriteItem && (favoriteItem.length > 0)) {
      await web.lists.getByTitle("Favorites").items.getById(favoriteItem[0].Id).delete();
    }
  }

  public async FavoriteReport(webUrl: string, reportId: number): Promise<boolean> {
    let web: Web = await new Web(webUrl);
    let report: any = await web.lists.getByTitle("Visualizations").items.getById(reportId).fieldValuesAsText.get();
    let favedInfo: ItemAddResult = await web.lists.getByTitle("Favorites").items
      .add({
        Title: report.Title,
        SVPVisualizationDescription: report.SVPVisualizationDescription,
        SVPFavoriteType: FavoriteType.COMMON,
        SVPVisualizationLookupId: reportId
      });

    if (favedInfo.item) {
      console.log(`Favorited report with id #${reportId}`);
      return true;
    } else {
      console.log("Favoriting report with id #${reportId} failed.");
      return false;
    }
  }
}