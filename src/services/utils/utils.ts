import { intersection } from "@microsoft/sp-lodash-subset";
import { IReportViewer } from "../../webparts/reportViewer/state/IReportViewerState";
import { 
    TABLEAU_SUPPORTED_TOOLBAR, 
    OFFICE_SUPPORTED_TOOLBAR,
    PDF_SUPPORTED_TOOLBAR,
    IMAGE_SUPPORTED_TOOLBAR,
    OTHER_SUPPORTED_TOOLBAR,
    UNKNOWN_SUPPORTED_TOOLBAR
} from "../../webparts/controls";

export class Utils {
    public static getParameterByName(name: string, url?: string) {
        if (!url) url = window.location.search;
        url = url.toLowerCase();
        name = name.toLowerCase();

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
        let input: string = viewer.tableauReportConfig.SVPTableauToolbar;

        switch(viewer.report.SVPVisualizationTechnology) {
            case "Tableau":
                supportedToolbar = TABLEAU_SUPPORTED_TOOLBAR;
                break;

            case "Office":
                supportedToolbar = OFFICE_SUPPORTED_TOOLBAR;
                break;

            case "PDF":
                supportedToolbar = PDF_SUPPORTED_TOOLBAR;
                break;

            case "Image":
                supportedToolbar = IMAGE_SUPPORTED_TOOLBAR;
                break;

            case "Other":
                supportedToolbar = OTHER_SUPPORTED_TOOLBAR;
                break;

            default:
                supportedToolbar = UNKNOWN_SUPPORTED_TOOLBAR;
                break;
        }

        if (!input || input.length === 0)
            return supportedToolbar;

        const inputs = input.split(",").map((i: string) => i.trim());
        return intersection(inputs, supportedToolbar);
    }

    /**
     * Function to get Site Collection URL
     * Samples:
     *      "https://domain.sharepoint.com/sites/intranet"
     */
    public static getSiteCollectionUrl(): string {

        let baseUrl = window.location.protocol + "//" + window.location.host;
  
        const pathname = window.location.pathname;
        const siteCollectionDetector = "/sites/";
  
        if (pathname.indexOf(siteCollectionDetector) >= 0) {
          baseUrl += pathname.substring(0, pathname.indexOf("/", siteCollectionDetector.length));
        }
  
        return baseUrl;
  
      }
    
    
      /**
       * Function to get Current Site Url
       * Samples:
       *      "https://domain.sharepoint.com/sites/intranet/subsite/Pages/Home.aspx"
       */
      public static getCurrentAbsoluteSiteUrl(): string {
  
        if (window
          && window.hasOwnProperty("location")
          && window.location.hasOwnProperty("protocol")
          && window.location.hasOwnProperty("host")
          && window.location.hasOwnProperty("pathname")) {
  
          return window.location.protocol + "//" + window.location.host + window.location.pathname;
  
        }
  
        return null;
  
      }
    
      /**
       * Function to get Current Site Url
       * Samples:
       *      "/sites/intranet"
       */
      public static getWebServerRelativeUrl(): string {
  
        if (window
          && window.hasOwnProperty("location")
          && window.location.hasOwnProperty("pathname")) {
  
          return  window.location.pathname.replace(/\/$/, "");
  
        }
  
        return null;
  
      }
    
      /**
       * Function to get Layout Page Url
       * Replacement in SPFx for SP.Utilities.Utility.getLayoutsPageUrl('sp.js')
       * Samples:
       *      getLayoutsPageUrl('sp.js')
       *      "/sites/intranet/_layouts/15/sp.js"
       */
      public static getLayoutsPageUrl(libraryName: string): string {
  
        if (window
          && window.hasOwnProperty("location")
          && window.location.hasOwnProperty("pathname")
          && libraryName !== "") {
  
          return  window.location.pathname.replace(/\/$/, "") + "/_layouts/15/" + libraryName;
  
        }
  
        return null;
  
      }
    
      /**
       * Function to get Current Domain Url
       * Samples:
       *      "https://domain.sharepoint.com"
       */
      public static getAbsoluteDomainUrl(): string {
  
        if (window
          && window.hasOwnProperty("location")
          && window.location.hasOwnProperty("protocol")
          && window.location.hasOwnProperty("host")) {
  
          return window.location.protocol + "//" + window.location.host;
  
        }
  
        return null;
  
      }
}