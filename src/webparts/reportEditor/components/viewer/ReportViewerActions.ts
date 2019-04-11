import { IReportEditorState, ICountry, CountrySchema } from "../../state/IReportEditorState";
import { MockService, IMockService } from '../../../../services';
import { normalize } from 'normalizr';

export class ReportViewerActions {
    private api: IMockService;

    constructor(
        private getState: () => IReportEditorState,
        private dispatcher: (state: any) => void,
        private dispatcherByPath: (path: string, update: ICountry) => void) 
    {
            this.api = new MockService();
    }

    public async loadReportData() {
        this.dispatch({ loading: true });

        const [ reports, countries, brands ] = await Promise.all([
            this.api.loadReports(100),
            this.api.loadCountries(100),
            this.api.loadBrands(100)
        ]);

        const countriesData = normalize(countries, [CountrySchema]);

        const state = { 
            reports,
            countries,
            brands,
            countryEntities: countriesData.entities.countries,
            loading: false
        };

        window.setTimeout(() => {
            this.dispatch(state);
        }, 3000);
    }

    public saveCountry(country: ICountry) {
        const countryId = country.id;
        const countryPath = `reportViewer.countryEntities[${countryId}]`;

        //saving....
        const updates = {...country, ...{ isSaving: true }};
        this.dispatchByPath(countryPath, updates);

        //saved
        const updates1 = {...country, ...{ title: `${country.title} - Updated${countryId}`, isSaving: false }};
        window.setTimeout(() => {
            this.dispatchByPath(countryPath, updates1);
        }, this.getRandomSeconds(10));
    }

    private getRandomSeconds(max: number) {
        return ((Math.floor(Math.random() * Math.floor(max))) + 1) * 1000;
    }

    private async dispatchByPath(path: string, incoming: any) {
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