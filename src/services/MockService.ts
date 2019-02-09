import { IReportEditorState, IReport, ICountry, IBrand } from "../webparts/reportEditor/state/IReportEditorState";

export class MockService {

    public loadReports(count?: number): Promise<Array<IReport>> {
        return Promise.resolve(this.loadFakeData("Report"));
    }

    public loadCountries(count?: number): Promise<Array<ICountry>> {
        return Promise.resolve(this.loadFakeData("Country"));
    }

    public loadBrands(count?: number): Promise<Array<IBrand>> {
        return Promise.resolve(this.loadFakeData("Brand"));
    }

    private loadFakeData(type: string, count?: number): Array<any> {
        const data: Array<any> = [];
        const start: number = count || 0;

        for (var i=start; i<(start+10); i++) {
            if (type === "Report") data.push({ id: i, title: `${type }${i}`, pubDate: `2019/6/1${i}`, isSaving: false});
            else data.push({ id: i, title: `${type }${i}`, isSaving: false});
        }

        return data;
    }
}