import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "ReportEditorWebPartStrings";
import {
  ReportEditorProvider,
  ReportEditorProviderProps
} from "./ReportEditorProvider";

import { BaseWebpart, IInitConfig } from "../../base";

export interface IReportEditorWebPartProps {
  description: string;
}

//********
//  Following changes will provide
//  1. Loading CSS from local dev (if configureForWorkbench==true)
//  2. Loading JSOM libraries (if loadJSOM=true)
//  3. Setup SP PNP context

//  Change base class from "BaseClientSideWebPart" to "BaseWebpart"
//  Add constructor func:
//    constructor() {
//      super({
//        "configureForWorkbench": true,
//        "loadJSOM": true
//      });
//    }
//*******

export default class ReportEditorWebPart extends BaseWebpart<
  IReportEditorWebPartProps
> {
  constructor() {
    super({ loadJSOM: true });
  }

  public render(): void {
    const element: React.ReactElement<
      ReportEditorProviderProps
    > = React.createElement(ReportEditorProvider, {
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
