import * as React from 'react';
import { ReportEditorStore } from './store/ReportEditorStore';
import { ReportEditorWithState } from './components/editor/ReportEditor';
import { ReportViewerWithState } from './components/viewer/ReportViewer';

export interface ReportEditorProviderProps {
    description: string;
}
 
export interface ReportEditorProviderState {
    
}
 
export class ReportEditorProvider extends React.Component<ReportEditorProviderProps, ReportEditorProviderState> {
    constructor(props: ReportEditorProviderProps) {
        super(props);
    }

    public render() { 
        return (  
            <ReportEditorStore>
                <ReportEditorWithState description={"Editor Report"} />
                <hr />
                <ReportViewerWithState description={"Viewer Report"} />
            </ReportEditorStore>
        );
    }
}
 
