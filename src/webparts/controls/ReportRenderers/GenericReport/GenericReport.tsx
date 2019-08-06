import * as React from 'react';
import { autobind, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { IReportItem  } from "../../../../models";
import { reporters } from 'mocha';
import { any } from 'prop-types';
var PDFObject: any = require('pdfobject');

declare var $: any;

export const OFFICE_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "learn"];
export const PDF_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "learn"];
export const IMAGE_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "learn"];
export const OTHER_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "learn"];
export const UNKNOWN_SUPPORTED_TOOLBAR = [];

export const OfficeReport: React.FunctionComponent<IReportItem> = report => {
    const frameLoaded = () => {
        if (report.SVPVisualizationTechnology === "Other") {
            try {
                const frame: any = document.getElementById("officeFrame");
                const frameWindow = (frame.contentWindow || frame.contentDocument);
                if (frameWindow && frameWindow.document) {
                    const frameDocument = frameWindow.document as HTMLDocument; 

                    let count = 0;
                    let stateCheck = setInterval(() => {
                        if (count > 10) 
                            clearInterval(stateCheck);
                        
                        count++;

                        const closeBtn = frameDocument.getElementsByName("Close");
                    
                        if (closeBtn && closeBtn.length > 0) {
                            clearInterval(stateCheck);

                            const cmdBar = frameDocument.getElementsByClassName("OneUp-commandBar");
                            if (cmdBar && cmdBar.length > 0) {
                                const parent = (cmdBar[0] as HTMLElement).parentNode;
                                parent.removeChild(cmdBar[0]);
                            }

                            const cmdBarHost = frameDocument.getElementsByClassName("OneUp--hasCommandBar");
                            if (cmdBarHost && cmdBarHost.length > 0) {
                                const div = (cmdBarHost[0] as HTMLElement);
                                div.className = div.className.replace(/\bOneUp--hasCommandBar\b/g, "");
                            }
                        }
                    }, 100);
                }
            } catch (error) {   
                console.error(error);
            }
        }
    };

    const r = new RegExp(/([?|&]action=)[^\&]+/i);
    const url = report.SVPVisualizationAddress.replace(r, '$1' + 'embedview');
    //const height = (report.SVPReportHeight === -1) ? '700px' : `${report.SVPReportHeight}px`;
    const height = `${report.SVPReportHeight}px`;
    //const url = `${report.FileWebUrl}/_layouts/15/Doc.aspx?sourcedoc={${report.UniqueId}}&file=${report.FileLeafRef}&action=embedview`;

    return ( 
        <iframe onLoad={frameLoaded} id="officeFrame" frameBorder={0} src={url} width='100%' height={height}></iframe>
    );
};

export const PDFReport: React.FunctionComponent<IReportItem> = report => {
    const pdfStyles = {
        // height: (report.SVPReportHeight === -1) ? 600 : report.SVPReportHeight,
        // width: (report.SVPReportWidth === -1) ? '100%' : report.SVPReportWidth
        height: report.SVPReportHeight,
        width: report.SVPReportWidth
    };

    return ( 
        <div id="pdfDocument" style={pdfStyles}></div>
    );
};

export const ImageReport: React.FunctionComponent<IReportItem> = report => {
    const divStyles = {
        // height: (report.SVPReportHeight === -1) ? 600 : report.SVPReportHeight,
        // width: (report.SVPReportWidth === -1) ? '100%' : report.SVPReportWidth
        height: report.SVPReportHeight,
        width: report.SVPReportWidth
    };

    const imgStyles = {
        display: "block",
        // maxHeight: (report.SVPReportHeight === -1) ? 800 : report.SVPReportHeight,
        // maxWidth: (report.SVPReportWidth === -1) ? '100%' : report.SVPReportWidth,
        maxHeight: report.SVPReportHeight,
        maxWidth: report.SVPReportWidth,
        width: "auto",
        height: "auto"
    };

    return ( 
        <div style={divStyles}>
            <img src={report.SVPVisualizationAddress} style={imgStyles} />
        </div>
    );
};

export const UnknownReport: React.FunctionComponent<IReportItem> = report => {
    const message = `${report.SVPVisualizationTechnology} report format is currently not supported.`;

    return ( 
        <MessageBar messageBarType={MessageBarType.error}>
            { message }        
        </MessageBar>
    );
};

export interface IGenericReportProps {
    report: IReportItem;
    height?: number;
    width?: number;
}
 
export interface IGenericReportState {
    
}

class GenericReport extends React.Component<IGenericReportProps, IGenericReportState> {
    private report: IReportItem = null;

    constructor(props: IGenericReportProps) {
        super(props);
        
        this.report = { ...this.props.report, 
            "SVPReportWidth": this.props.width, 
            "SVPReportHeight": this.props.height };
    }

    @autobind
    public componentDidMount() {
        if (this.report.SVPVisualizationTechnology === 'PDF') {
            var options = {
                pdfOpenParams: {
                    navpanes: 1,
                    toolbar: 1,
                    statusbar: 1,
                    messages: 1,
                    view: "FitH",
                    pagemode: "none"
                }
            };

            PDFObject.embed(this.props.report.SVPVisualizationAddress, '#pdfDocument', options);
        }

        
    }

    @autobind
    public render() { 
        return this.getReportComponent(this.report);
    }

    @autobind
    private getReportComponent(report: IReportItem) {
        let reportComponent: JSX.Element = null;

        switch(report.SVPVisualizationTechnology) {
            case "Office":
            case "Other":
                reportComponent = OfficeReport(report);
                break;   

            case "PDF":
                reportComponent = PDFReport(report);
                break;

            case "Image":
                reportComponent = ImageReport(report);
                break;

            default:
                reportComponent = UnknownReport(report);
                break;
        }

        return reportComponent;
    }
}
 
export { GenericReport };