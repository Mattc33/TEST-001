import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";

import { 
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from "@microsoft/sp-property-pane";

import { ITableauReportViewerConfig } from "../../models";
import { ReportViewerProviderSFC } from "./ReportViewerProvider";
import { IReportViewerProviderProps } from "./state/IReportViewerProviderProps";
import { BaseWebpart, IInitConfig } from "../../base";

export interface IReportViewerWebPartProps extends ITableauReportViewerConfig {
  // ITableauReportViewerWebPartProps Props
  // SVPTableauJavaScriptURL: string;
  // SVPTableauToolbar: string;
  // SVPDefaultReportHeight: number;
  // SPVDefaultReportWidth: number;
}

export default class ReportViewerWebPart extends BaseWebpart<IReportViewerWebPartProps> {
  constructor() {
    super({ loadJSOM: true, loadTableau: true });

  }

  public render(): void {
    const element: React.ReactElement<IReportViewerProviderProps> = React.createElement(
      ReportViewerProviderSFC, {
        context: this.context,
        tableauReportConfig: {
          SVPTableauJavaScriptURL: this.properties.SVPTableauJavaScriptURL,
          SVPTableauToolbar: this.properties.SVPTableauToolbar
        }
    });

    ReactDom.render(element, this.domElement);
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
          groups: [
            {
              groupName: "Tableau Report Configurations",
              groupFields: [
                PropertyPaneTextField("SVPTableauJavaScriptURL", {
                  label: "Tableau JavaScript API URL"
                }),
                PropertyPaneTextField("SVPTableauToolbar", {
                  label: "Toolbar Controls for Tableau Report",
                  description: "Comma separated values toolbar buttons. Valid values are [sizing, savecustom, feedback, profilefilter, fullscreen]"
                })
              ]
            },
            {
              groupName: "Excel Report Configurations",
              groupFields: [
              ]
            },
            {
              groupName: "Pdf Report Configurations",
              groupFields: [
              ]
            }
          ]
        }
      ]
    };
  }
}
