import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "ReportViewerWebPartStrings";
import {
  ReportViewerProviderSFC,
  IReportViewerProviderProps
} from "./ReportViewerProvider";
import { BaseWebpart, IInitConfig } from "../../base";

export interface IReportViewerWebPartProps {
  description: string;
}

export default class ReportViewerWebPart extends BaseWebpart<IReportViewerWebPartProps> {
  constructor() {
    super({ loadJSOM: true, loadTableau: true });
  }

  public render(): void {
    const element: React.ReactElement<IReportViewerProviderProps> = React.createElement(
      ReportViewerProviderSFC, {
        description: this.properties.description
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}