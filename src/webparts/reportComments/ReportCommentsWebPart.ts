import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import * as strings from 'ReportCommentsWebPartStrings';

import { IReportCommentsProviderProps, ReportCommentsProvider } from "./ReportCommentsProvider";

export interface IReportCommentsWebPartProps {
  clientLabel:string;
  commentsMaxCount:number;
  visualizationListID:string;
}

export default class ReportCommentsWebPart extends BaseClientSideWebPart<IReportCommentsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReportCommentsProviderProps > = React.createElement(
      ReportCommentsProvider,
      {
        context: this.context,
        clientLabel: this.properties.clientLabel,
        commentsMaxCount: this.properties.commentsMaxCount,
        visualizationListID: this.properties.visualizationListID
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
                PropertyPaneSlider('commentsMaxCount', {
                  label: strings.CommentsMaxCount,
                  min: 5,
                  max: 100,
                  value: 5,
                  showValue: true,
                  step: 5
                })
              ]
            },
            {
              groupName: strings.AdvanceGroupName,
              groupFields: [
                PropertyPaneTextField('visualizationListID', {
                  label: strings.VisualizationListID,
                  value: ""
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
