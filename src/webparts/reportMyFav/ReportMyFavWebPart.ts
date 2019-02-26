import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { sp } from '@pnp/sp';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import * as strings from 'ReportMyFavWebPartStrings';
import {IReportMyFavProviderProps, ReportMyFavProvider} from "./report-myfav-provider";



export interface IReportMyFavWebPartProps {
  headerMessage: string;
  clientLabel:string;
  favReportCount:number;
}

export default class ReportMyFavWebPart extends BaseClientSideWebPart<IReportMyFavWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReportMyFavProviderProps> = React.createElement(
      ReportMyFavProvider,
      {
        context: this.context,
        headerMessage: this.properties.headerMessage,
        clientLabel: this.properties.clientLabel,
        favReportCount: this.properties.favReportCount
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    try {
      sp.setup({
        spfxContext: this.context
      });

      return Promise.resolve();

    } catch(err) {
      return Promise.reject(err);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('clientLabel', {
                  label: strings.ClientNameFieldLabel
                }),
                PropertyPaneTextField('headerMessage', {
                  label: strings.HeaderMessageFieldLabel,
                  value: "See all your most frequent used data in one place."
                }),
                PropertyPaneSlider('favReportCount', {
                  label: strings.FavReportsMaxCount,
                  min: 5,
                  max: 100,
                  value: 5,
                  showValue: true,
                  step: 5
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
