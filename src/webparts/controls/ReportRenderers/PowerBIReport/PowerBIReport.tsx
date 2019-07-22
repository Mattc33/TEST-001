import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
import Report from 'powerbi-report-component';
import Iframe from 'react-iframe';

declare var powerbi: any;

export const POWERBI_SUPPORTED_TOOLBAR = ["comment", "sizing", "savecustom", "feedback", "share", "fullscreen"];


export interface IPowerBIReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface IPowerBIReportState {
    
}

class PowerBIReport extends React.Component<IPowerBIReportProps,IPowerBIReportState> {

    private Viz: any;
    private report: any;
    private VizLoaded: boolean;

    constructor(props: IPowerBIReportProps) {
        super(props);

        this.VizLoaded = false;
    }

    @autobind
    public componentDidMount() {
        //this.initViz();
    }

    @autobind
    public componentWillReceiveProps(nextProps: IPowerBIReportProps) {
        if (this.Viz && this.VizLoaded && (this.props.height !== nextProps.height || this.props.width !== nextProps.width)) {
            this.Viz.setFrameSize(nextProps.width, nextProps.height);

            // this code re-size frame and reload report within new size...
            // const sheet = this.Viz.getWorkbook().getActiveSheet();
            // sheet.changeSizeAsync({"behavior": "EXACTLY", "maxSize": { "height": nextProps.height, "width": nextProps.width }})
            //     .then(this.Viz.setFrameSize(nextProps.width, nextProps.height));
        }
    }

    @autobind
    public render() { 

        var height = this.props.height + "px";
        var width = this.props.width + "px";

        return ( 
            <div id="vizPlaceholder" className="root">
                <Iframe url={this.props.reportURL}
                    width = {width}
                    height= {height}
                    id="pbiReportID"
                    className="myClassname"
                    display="inline"
                    position="relative"/>
            </div>
         );
    }



    private handleDataSelected = (data) => {
        // will be called when some chart or data element in your report clicked
      }
    
      private handleReportLoad = (report) => {
        // will be called when report loads
    
        this.report = report; // get the object from callback and store it.(optional)
      }
    
      private handlePageChange = (data) => {
        // will be called when pages in your report changes
      }
    
      private handleTileClicked = (dashboard, data) => { // only used when embedType is "dashboard"
        // will be called when report loads
    
        this.report = dashboard; // get the object from callback and store it.(optional)
        console.log('Data from tile', data);
      }

}

export { PowerBIReport };