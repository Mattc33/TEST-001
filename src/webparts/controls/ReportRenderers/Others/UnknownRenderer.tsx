import * as React from 'react';
import { autobind, MessageBar, MessageBarType } from 'office-ui-fabric-react';

export const UNKNOWN_SUPPORTED_TOOLBAR = [];

export interface IUnkownReportProps {
    reportType: string;
}
 
export interface IUnkownReportState {
    
}
 
class UnkownReport extends React.Component<IUnkownReportProps, IUnkownReportState> {

    constructor(props: IUnkownReportProps) {
        super(props);
    }

    @autobind
    public render() { 
        const message = `${this.props.reportType} report format is currently not supported.`;

        return ( 
            <MessageBar messageBarType={MessageBarType.error}>
                { message }        
            </MessageBar>
         );
    }
}
 
export { UnkownReport };