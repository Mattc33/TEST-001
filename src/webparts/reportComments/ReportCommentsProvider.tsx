import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import ReportCommentsPanel from "./components/ReportCommentsPanel";


export interface IReportCommentsProviderProps {
    context:WebPartContext;
    clientLabel:string;
    commentsMaxCount:number;
    visualizationListID:string;
}

export interface IReportCommentsProviderState {

}

export class ReportCommentsProvider extends React.Component<IReportCommentsProviderProps, IReportCommentsProviderState> {

    constructor(props:IReportCommentsProviderProps) {
        super(props);


    }

    public async componentDidMount() {

    }

    public render() : React.ReactElement<IReportCommentsProviderProps> {

        return(
            <ReportCommentsPanel 
                description = {this.props.visualizationListID}
            />
            
         );


    }
}