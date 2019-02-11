import * as React from 'react';
import { IReportEditorState, ICountry } from "../state/IReportEditorState";
import { ReportEditorActions } from '../components/editor/ReportEditorActions';
import { ReportViewerActions } from '../components/viewer/ReportViewerActions';
import { IContextProps } from './IContextProps';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import * as dot from 'ts-dot-prop';

export const ReportEditorContext = React.createContext<IContextProps>(undefined);

export class ReportEditorStore extends React.Component<any, IReportEditorState> {

    constructor(props: any) {
        super(props);
        
        this.dispatcher = this.dispatcher.bind(this);
        this.dispatcherByPath = this.dispatcherByPath.bind(this);
        this.getState = this.getState.bind(this);

        const editorActions = new ReportEditorActions(this.getState, this.dispatcher); 
        const viewerActions = new ReportViewerActions(this.getState, this.dispatcher, this.dispatcherByPath);

        this.state = { 
            reportEditor: { actions: editorActions, loading: true },
            reportViewer: { actions: viewerActions, loading: true }
        };
    }

    public dispatcher(incomingState: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const newState = { ...this.state, ...incomingState };
            this.setState(newState, () => {
                resolve();
            });
        });
    }

    public dispatcherByPath(path: string, update: ICountry): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setState((state: IReportEditorState) => {
                dot.set(state, path, update); //state.reportViewer.countryEntities[id] = update;
                return state;
            }, () => {
                resolve();
            });
        });
    }

    public getState(): IReportEditorState {
        return this.state; //return cloneDeep(this.state);
    }

    public render() { 
        const state = this.state; 

        return (  
            <ReportEditorContext.Provider value={{ state }}>
                {this.props.children}
            </ReportEditorContext.Provider>
        );
    }
}
