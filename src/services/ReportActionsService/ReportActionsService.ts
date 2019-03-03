import { sp, ItemAddResult, Item } from '@pnp/sp';

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

  public async FavoriteReport(reportId: number): Promise<boolean> {
    let report: any = await sp.web.lists.getByTitle("Visualizations").items.getById(reportId);

    let favedInfo: ItemAddResult = await sp.web.lists.getByTitle("Favorites")
      .items.add({
        Title: report.Title,
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