import { IReportEditorState } from "../../state/IReportEditorState";
import { MockService, IMockService } from '../../../../services';

export class ReportEditorActions {
    private api: IMockService;

    constructor(
        private getState: () => IReportEditorState,
        private dispatcher: (state: any) => void) {
            this.api = new MockService();
    }

    public async loadReportData() {
        this.dispatch({ loading: true });

        const [ reports, countries, brands ] = await Promise.all([
            this.api.loadReports(),
            this.api.loadCountries(),
            this.api.loadBrands()
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

    private dispatch(incoming: any) {
        this.dispatcher(
            { "reportEditor": 
                {
                    ...this.getState().reportEditor,
                    ...incoming
                } 
            }
        );
    }
}