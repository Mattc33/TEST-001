import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';

declare var tableau: any;

export const TABLEAU_SUPPORTED_TOOLBAR = ["comment", "sizing", "savecustom", "feedback", "share", "learn"];

export interface ITableauReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface ITableauReportState {
    
}
 
class TableauReport extends React.Component<ITableauReportProps, ITableauReportState> {
    private Viz: any;
    private VizWorkbook: any;
    private VizSheets: any;
    private VizSheet: any;
    private VizPlaceholder: HTMLDivElement;
    private VizLoaded: boolean;

    constructor(props: ITableauReportProps) {
        super(props);

        this.VizLoaded = false;
    }

    @autobind
    public componentDidMount() {
        this.initViz();
    }

    @autobind
    public componentWillReceiveProps(nextProps: ITableauReportProps) {
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
        return ( 
            <div id="vizPlaceholder" ref={v => this.VizPlaceholder = v}></div>
         );
    }

    @autobind
    public async saveCustomView(name: string): Promise<any> {
        let viewObj = undefined;

        if (this.Viz && this.VizWorkbook) {
            const view = await this.VizWorkbook.rememberCustomViewAsync(name);
            if (view) {
                viewObj = {
                    name: view.getName(),
                    owner: view.getOwnerName(),
                    url: view.getUrl()
                };
            }
        }

        return viewObj;
    }

    @autobind
    public getActiveSheetName() {
        let sheetName = undefined;

        if (this.Viz && this.VizSheet) 
            sheetName = this.VizSheet.getName();

        return sheetName;
    }

    @autobind
    private initViz() {
        if (this.Viz) {
            this.Viz.dispose();
            this.Viz = null;
            this.VizWorkbook = null;
            this.VizSheets = null;
            this.VizSheet = null;
        }

        const vizOptions = {
            hideTabs: true,
            hideToolbar: false,
            height: this.props.height,
            width: this.props.width,
            onFirstInteractive: (e) => {
                this.VizWorkbook = this.Viz.getWorkbook();
                this.VizSheets = this.VizWorkbook.getActiveSheet().getWorksheets();
                this.VizSheet = this.VizWorkbook.getActiveSheet(); //this.VizSheets[0];

                this.initEvents();

                //this.VizSheet.changeSizeAsync({"behavior": "EXACTLY", "maxSize": { "height": this.props.height, "width": this.props.width }});
            },
            onFirstVizSizeKnown: (e) => {
                
            }
        };

        this.Viz = new tableau.Viz(this.VizPlaceholder, this.props.reportURL, vizOptions);
    }

    @autobind
    private initEvents() {
        if (this.Viz) {
            this.VizLoaded = true;
            this.Viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, this.handleFilterChangeEvent);
            this.Viz.addEventListener(tableau.TableauEventName.PARAMETER_VALUE_CHANGE, this.handleFilterChangeEvent);
        }
    }

    @autobind
    private handleFilterChangeEvent(evt) { //evt: is of type FilterEvent 

    }
}
 
export { TableauReport };