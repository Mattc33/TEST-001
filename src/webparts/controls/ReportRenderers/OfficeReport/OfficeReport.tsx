import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
import { IReportItem  } from "../../../../models";
import { intersection } from "@microsoft/sp-lodash-subset";

declare var tableau: any;

export const OFFICE_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "fullscreen"];

export interface IOfficeReportProps {
    report: IReportItem;
    height?: number;
    width?: number;
}
 
export interface IOfficeReportState {
    
}
 
class OfficeReport extends React.Component<IOfficeReportProps, IOfficeReportState> {

    constructor(props: IOfficeReportProps) {
        super(props);
    }

    @autobind
    public render() { 
        const report = this.props.report;
        const url = `${report.FileWebUrl}/_layouts/15/Doc.aspx?sourcedoc={${report.UniqueId}}&file=${report.FileLeafRef}&action=embedview`;

        return ( 
            <iframe src={url} width='100%' height='700px'></iframe>
         );
    }
}
 
export { OfficeReport };