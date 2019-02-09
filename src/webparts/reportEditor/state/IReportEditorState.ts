import { ReportEditorActions } from '../components/editor/ReportEditorActions';
import { ReportViewerActions } from '../components/viewer/ReportViewerActions';

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
}

export interface IReportEditorState {
    reportEditor: IReportEditor;
    reportViewer: IReportViewer;
}