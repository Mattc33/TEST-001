import * as React from 'react';

declare var tableau: any;

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

    constructor(props: ITableauReportProps) {
        super(props);
    }

    public componentDidMount() {
        this.initViz();
    }

    public componentWillReceiveProps(nextProps: ITableauReportProps) {
        if (this.Viz && (this.props.height !== nextProps.height || this.props.width !== nextProps.width)) {
            this.Viz.setFrameSize(nextProps.width, nextProps.height);
        }
    }

    public render() { 
        return ( 
            <div id="vizPlaceholder" ref={v => this.VizPlaceholder = v}></div>
         );
    }

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

    public getActiveSheetName() {
        let sheetName = undefined;

        if (this.Viz && this.VizSheet) 
            sheetName = this.VizSheet.getName();

        return sheetName;
    }

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
            hideToolbar: true,
            height: this.props.height,
            width: this.props.width,
            onFirstInteractive: () => {
              this.VizWorkbook = this.Viz.getWorkbook();
              this.VizSheets = this.VizWorkbook.getActiveSheet().getWorksheets();
              this.VizSheet = this.VizWorkbook.getActiveSheet(); //this.VizSheets[0];
            }
        };

        this.Viz = new tableau.Viz(this.VizPlaceholder, this.props.reportURL, vizOptions);
    }
}
 
export { TableauReport };