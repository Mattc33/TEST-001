import {
  IReportViewerState,
  IErrorResult,
  REPORT_VIEWER_PATH
} from "../../state/IReportViewerState";
import { ReportViewerService, IReportViewerService } from "../../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../../base";
import { withErrHandler } from "../../../../utils/withErrorHandler";
import { IReportItem } from "../../../../models";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private api: IReportViewerService;

  constructor(store: IBaseStore) {
    super(store);
    this.api = new ReportViewerService();
  }

  public async loadReportData(reportId: any) {
    this.dispatch({ loading: true });

    if (!reportId || isNaN(reportId)) {
      const error: IErrorResult = {
        errorMessage: `Invalid or missing reportId parameter: ${reportId}`
      };

      this.dispatch({ loading: false, error });
      return;
    }
    
    //TODO: error check & validation (report exists and its tableau report)
    //TODO: check reportId param is number and not NaN
    const [item, err] = await withErrHandler<IReportItem>(this.api.loadReportDefinition(parseInt(reportId)));
    if (err) {
      const error: IErrorResult = {
        errorMessage: `Report doesn't exists or you don't have permission to view this report: ${reportId}`,
        error: err
      };

      console.error('loadReportData', item, err);
      this.dispatch({ loading: false, error });
      return;
    }

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
