import { IReportEditorState, ICountry } from "../../state/IReportEditorState";
import { MockService, IMockService } from '../../../../services';

export class ReportViewerActions {
    private api: IMockService;

    constructor(
        private getState: () => IReportEditorState,
        private dispatcher: (state: any) => void) {
            this.api = new MockService();
    }

    public async loadReportData() {
        this.dispatch({ loading: true });

        const [ reports, countries, brands ] = await Promise.all([
            this.api.loadReports(100),
            this.api.loadCountries(100),
            this.api.loadBrands(100)
        ]);

        const state = { 
            reports,
            countries,
            brands,
            loading: false
        };

        window.setTimeout(() => {
            this.dispatch(state);
        }, 3000);
    }

    public saveCountry(country: ICountry) {
        console.info('saveCountry', country, this.getState());

        //TODO: this.getState() - add param to return item graph with clone
        const countries = this.getState().reportViewer.countries.map((obj) => { return {...obj}; });
        const updates = countries.map((c: ICountry) => {
            if (c.id === country.id) 
                c.isSaving = true;
            
            return c;
        });

        this.dispatch({ countries: updates });

        // const viewerProps1 = { ...this.getState().reportViewer };
        const countries1 = this.getState().reportViewer.countries.map((obj) => { return {...obj}; });// const countries1 = [ ...viewerProps1.countries ];
        const updates1 = countries1.map((c: ICountry) => {
            if (c.id === country.id) {
                c.title = c.title + " - Updated";
                c.isSaving = false;
            }
            
            return c;
        });

        window.setTimeout(() => {
            this.dispatch({ countries: updates1 });
        }, 3000);
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