import { ReportEditorActions } from '../components/editor/ReportEditorActions';
import { ReportViewerActions } from '../components/viewer/ReportViewerActions';
import { schema } from 'normalizr';

export const CountrySchema = new schema.Entity('countries', undefined, { idAttribute: 'id' });

export interface IBase {
    id: number;
    title: string;
    isSaving: boolean;
}

export interface IReport extends IBase {
    pubDate: string;
}

export interface ICountry extends IBase {

}

export interface IBrand extends IBase {

}

export interface IEntity<T> extends Object {
    [id: number]: T;
}

export interface ICountryEntity {
    countries: IEntity<ICountry>;
}

export interface IReportEditor {
    loading?: boolean;
    reports?: Array<IReport>;
    countries?: Array<ICountry>;
    brands?: Array<IBrand>;
    actions?: ReportEditorActions;
}

export interface IReportViewer {
    loading?: boolean;
    reports?: Array<IReport>;
    countries?: Array<ICountry>;
    brands?: Array<IBrand>;
    actions?: ReportViewerActions;
    countryEntities?: IEntity<ICountry>;
}

export interface IReportEditorState {
    reportEditor: IReportEditor;
    reportViewer: IReportViewer;
}