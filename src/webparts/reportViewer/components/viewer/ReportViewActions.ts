import { IReportViewerState } from "../../state/IReportViewerState";
import { MockService, IMockService } from '../../../../services';
import { normalize } from 'normalizr';

export class ReportViewerActions {
    private api: IMockService;

    constructor(
        private getState: () => IReportViewerState,
        private dispatcher: (state: any) => void,
        private dispatcherByPath: (path: string, update: any) => void) 
    {
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

        // window.setTimeout(() => {
        //     this.dispatch(state);
        // }, 3000);
    }

    private async dispatchByPath(path: string, incoming: any) {
        console.info('dispatchByPath', path);
        await this.dispatcherByPath(path, incoming);
    }

    private async dispatch(incoming: any) {
        await this.dispatcher(
            { "reportViewer": 
                {
                    ...this.getState().reportViewer,
                    ...incoming
                } 
            }
        );
    }
}