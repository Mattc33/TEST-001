import {
  IReportViewerState,
  REPORT_VIEWER_PATH
} from "../../state/IReportViewerState";
import { ReportViewerService, IReportViewerService } from "../../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../../base";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private api: IReportViewerService;

  constructor(store: IBaseStore) {
    super(store);
    this.api = new ReportViewerService();
  }

  public async loadReportData(reportId: number) {
    this.dispatch({ loading: true });

    //TODO: error check & validation (report exists and its tableau report)
    //TODO: check reportId param is number and not NaN
    const item = await this.api.loadReportDefinition(reportId);
    item.SVPHeight = item.SVPHeight || 704;
    item.SVPWidth = item.SVPWidth || 799;

    console.info('loadReportData', item);

    this.dispatch({ loading: false, report: item });
  }

  private async dispatchByPath(path: string, incoming: any) {
    await this.dispatcherByPath(path, incoming);
  }

  private async dispatch(incoming: any) {
    await this.dispatcher({
      [REPORT_VIEWER_PATH]: {
        ...this.getState()[REPORT_VIEWER_PATH],
        ...incoming
      }
    });
  }
}
