import { intersection } from "@microsoft/sp-lodash-subset";
import { IReportViewer } from "../../webparts/reportViewer/state/IReportViewerState";
import { 
    TABLEAU_SUPPORTED_TOOLBAR, 
    OFFICE_SUPPORTED_TOOLBAR,
    PDF_SUPPORTED_TOOLBAR,
    IMAGE_SUPPORTED_TOOLBAR,
    UNKNOWN_SUPPORTED_TOOLBAR
} from "../../webparts/controls";

export class Utils {
    public static getParameterByName(name: string, url?: string) {
        if (!url) url = window.location.search;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    public static getToolbar(viewer: IReportViewer): Array<string> {
        if (!viewer || !viewer.report) 
            return [];
        
        let supportedToolbar: Array<string> = [];
        let input: string = '';

        switch(viewer.report.SVPVisualizationTechnology) {
            case "Tableau":
                input = viewer.tableauReportConfig.SVPTableauToolbar;
                supportedToolbar = TABLEAU_SUPPORTED_TOOLBAR;
                break;

            case "Office":
                input = ''; //TODO: implement webpart props
                supportedToolbar = OFFICE_SUPPORTED_TOOLBAR;
                break;

            case "PDF":
                input = ''; //TODO: implement webpart props
                supportedToolbar = PDF_SUPPORTED_TOOLBAR;
                break;

            case "Image":
                input = ''; //TODO: implement webpart props
                supportedToolbar = IMAGE_SUPPORTED_TOOLBAR;
                break;

            default:
                input = ''; 
                supportedToolbar = UNKNOWN_SUPPORTED_TOOLBAR;
                break;
        }

        if (!input || input.length === 0)
            return supportedToolbar;

        const inputs = input.split(",").map((i: string) => i.trim());
        return intersection(inputs, supportedToolbar);
    }
}