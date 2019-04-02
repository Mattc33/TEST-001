import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
import { intersection } from "@microsoft/sp-lodash-subset";

declare var tableau: any;

const SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "fullscreen"];

export interface IOfficeReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface IOfficeReportState {
    
}
 
class OfficeReport extends React.Component<IOfficeReportProps, IOfficeReportState> {

    constructor(props: IOfficeReportProps) {
        super(props);
    }

    public static getToolbar(input: string): Array<string> {
        if (!input || input.length === 0)
            return SUPPORTED_TOOLBAR;

        return intersection(input.split(","), SUPPORTED_TOOLBAR);
    }

    @autobind
    public componentDidMount() {
        
    }

    @autobind
    public render() { 
        return ( 
            <div id="vizPlaceholder"></div>
         );
    }

    
}
 
export { OfficeReport };