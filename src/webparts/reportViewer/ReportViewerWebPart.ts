import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";

import { 
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from "@microsoft/sp-property-pane";

import { ITableauReportViewerConfig } from "../../models";
import { ReportViewerProviderSFC } from "./ReportViewerProvider";
import { IReportViewerProviderProps } from "./state/IReportViewerProviderProps";
import { BaseWebpart, IInitConfig } from "../../base";

export interface IReportViewerWebPartProps extends ITableauReportViewerConfig {
  SVPClientLabel: string;
  // ITableauReportViewerWebPartProps Props
  // SVPTableauJavaScriptURL: string;
  // SVPTableauToolbar: string;
  // SVPDefaultReportHeight: number;
  // SPVDefaultReportWidth: number;
  SVPMetadata:string;
  SVPUseSentimentService: boolean;
  SVPSentimentServiceAPI: string;
  SVPSentimentServiceKey: string;
}

export default class ReportViewerWebPart extends BaseWebpart<IReportViewerWebPartProps> {
  constructor() {
    super({ loadJSOM: true, loadTableau: true });

  }

  public render(): void {
    const element: React.ReactElement<IReportViewerProviderProps> = React.createElement(
      ReportViewerProviderSFC, {
        SVPClientLabel: this.properties.SVPClientLabel,       
        context: this.context,
        tableauReportConfig: {
          SVPTableauJavaScriptURL: this.properties.SVPTableauJavaScriptURL,
          SVPTableauToolbar: this.properties.SVPTableauToolbar
        },
        SVPMetadata:this.properties.SVPMetadata,
        SVPUseSentimentService:this.properties.SVPUseSentimentService,
        SVPSentimentServiceAPI:this.properties.SVPSentimentServiceAPI,
        SVPSentimentServiceKey:this.properties.SVPSentimentServiceKey
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit() {
    super.onBeforeInit(this.properties.SVPTableauJavaScriptURL);
    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Report Viewer Properties"
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Report Viewer Basic Settings",
              groupFields: [
                PropertyPaneTextField("SVPClientLabel", {
                  label: "Client Label"
                }),
                PropertyPaneTextField("SVPTableauJavaScriptURL", {
                  label: "Tableau JavaScript API URL"
                }),
                PropertyPaneTextField("SVPTableauToolbar", {
                  label: "Report Toolbar Controls",
                  description: "Comma separated values for toolbar buttons. Valid values are [sizing,savecustom,feedback,profilefilter,fullscreen]"
                }),
                PropertyPaneTextField("SVPMetadata", {
                  label: "Report Metadata",
                  description: "Metadata Display Name and Internal Name mapping JSON string"
                })
              ]
            },
            {
              groupName: "Report Viewer Advance Settings",
              groupFields: [
                PropertyPaneToggle("SVPUseSentimentService", {
                  label: "Use Sentiment Service"
                }),
                PropertyPaneTextField("SVPSentimentServiceAPI", {
                  label: "Sentiment Service API"
                }),
                PropertyPaneTextField("SVPSentimentServiceKey", {
                  label: "Sentiment Service Key"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
