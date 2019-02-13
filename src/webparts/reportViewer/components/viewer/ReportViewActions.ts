import {
  IReportViewerState,
  REPORT_VIEWER_PATH
} from "../../state/IReportViewerState";
import { MockService, IMockService } from "../../../../services";
import { normalize } from "normalizr";
import { BaseAction, IBaseStore } from "../../../../base";

export class ReportViewerActions extends BaseAction<IReportViewerState,IBaseStore> {
  private api: IMockService;

  constructor(store: IBaseStore) {
    super(store);
    this.api = new MockService();
  }

  public async loadReportData() {
    this.dispatch({ loading: true });

    // const [ reports, countries, brands ] = await Promise.all([
    //     this.api.loadReports(100),
    //     this.api.loadCountries(100),
    //     this.api.loadBrands(100)
    // ]);

    // const countriesData = normalize(countries, [CountrySchema]);

    // const state = {
    //     reports,
    //     countries,
    //     brands,
    //     countryEntities: countriesData.entities.countries,
    //     loading: false
    // };

    window.setTimeout(() => {
      this.dispatch({ loading: false });
    }, 3000);
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
