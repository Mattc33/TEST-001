import * as React from 'react';
import { ReportViewerStore } from './store/ReportViewerStore';

export interface ReportViewerProviderProps {
    description: string;
}
 
export interface ReportViewerProviderState {
    
}
 
export class ReportViewerProvider extends React.Component<ReportViewerProviderProps, ReportViewerProviderState> {
    constructor(props: ReportViewerProviderProps) {
        super(props);
    }

    public render() { 
        return (  
            <ReportViewerStore>
                 <hr />
             </ReportViewerStore>
        );
    }
}
 
