import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
var PDFObject: any = require('pdfobject');

export const PDF_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "fullscreen"];

export interface IPDFReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface IPDFReportState {
    
}
 
class PDFReport extends React.Component<IPDFReportProps, IPDFReportState> {

    constructor(props: IPDFReportProps) {
        super(props);
    }

    @autobind
    public componentDidMount() {
        var options = {
            //height: `${this.props.height}px`,
            //width: `${this.props.width}px`,
            pdfOpenParams: {
                navpanes: 1,
                toolbar: 1,
                statusbar: 1,
                messages: 1,
                view: "FitH",
                pagemode: "none"
                //page: 2
            }
            //forcePDFJS: true,
            //PDFJS_URL: "../pdfjs/web/viewer.html"
        };

        PDFObject.embed(this.props.reportURL, '#pdfDocument', options);
    }

    @autobind
    public render() { 
        const pdfStyles = {
            height: this.props.height,
            width: this.props.width
        };

        return ( 
            <div id="pdfDocument" style={pdfStyles}></div>
         );
    }
}
 
export { PDFReport };