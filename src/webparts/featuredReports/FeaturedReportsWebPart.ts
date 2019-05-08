import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'FeaturedReportsWebPartStrings';
import { FeaturedReportsProviderSFC } from './FeaturedReportsProvider';
import { IFeaturedReportsProviderProps } from './state/IFeaturedReportsProviderProps';
import { BaseWebpart, IInitConfig } from "../../base";

export interface IFeaturedReportsWebPartProps {
  SVPClientLabel: string;
}

export default class FeaturedReportsWebPart extends BaseWebpart<IFeaturedReportsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFeaturedReportsProviderProps> = React.createElement(
      FeaturedReportsProviderSFC,
      {
        SVPClientLabel: this.properties.SVPClientLabel,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
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
            description: "Best in Class Reports Properties"
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Best in Class Reports Basic Settings",
              groupFields: [
                PropertyPaneTextField("SVPClientLabel", {
                  label: "Client Label"
                })
              ]
            },
            {
              groupName: "Best in Class Reports Advance Settings",
              groupFields: [
              ]
            }
          ]
        }
      ]
    };
  }
}
