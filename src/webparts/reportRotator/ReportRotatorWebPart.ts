import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { sp } from '@pnp/sp';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from '@microsoft/sp-webpart-base';

import * as strings from 'ReportRotatorWebPartStrings';
import { IReportRotatorProviderProps, ReportRotatorProvider } from './report-rotator-provider';

export interface IReportRotatorWebPartProps {
  enableNavigation: boolean;
  enablePagination: boolean;
  enableVerticalReport:boolean;
  enableAutoplay: boolean;
  delayAutoplay: number;
  disableAutoplayOnInteraction: boolean;
  slidesPerView: string;
  slidesPerGroup: string;
  spaceBetweenSlides: string;
  enableGrabCursor: boolean;
  enableLoop: boolean;
}

export default class ReportRotatorWebPart extends BaseClientSideWebPart<IReportRotatorWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReportRotatorProviderProps> = React.createElement(
      ReportRotatorProvider,
      {
        context: this.context,
        enableNavigation: this.properties.enableNavigation,
        enablePagination: this.properties.enablePagination,
        enableVerticalReport:this.properties.enableVerticalReport,
        enableAutoplay: this.properties.enableAutoplay,
        delayAutoplay: this.properties.delayAutoplay,
        disableAutoplayOnInteraction: this.properties.disableAutoplayOnInteraction,
        slidesPerView: this.properties.slidesPerView,
        slidesPerGroup: this.properties.slidesPerGroup,
        spaceBetweenSlides: this.properties.spaceBetweenSlides,
        enableGrabCursor: this.properties.enableGrabCursor,
        enableLoop: this.properties.enableLoop
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
            description: strings.ReportOptions
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle('enableNavigation', {
                  label: strings.EnableNavigation
                }),
                PropertyPaneToggle('enablePagination', {
                  label: strings.EnablePagination,
                  checked: true
                }),
                PropertyPaneToggle('enableVerticalReport', {
                  label: strings.EnableVerticalReport,
                  checked: true
                }),
                PropertyPaneTextField('slidesPerView', {
                  label: strings.ReportsPerView,
                  value: '3'
                })
              ]
            },
            {
              groupName: strings.AutoplayGroupName,
              groupFields: [
                PropertyPaneToggle('enableAutoplay', {
                  label: strings.EnableAutoplay
                }),
                PropertyPaneTextField('delayAutoplay', {
                  label: strings.DelayAutoplay,
                  description: strings.Miliseconds,
                  value: '2500',
                  disabled: !this.properties.enableAutoplay
                }),
                PropertyPaneToggle('disableAutoplayOnInteraction', {
                  label: strings.DisableAutoplayOnInteraction,
                  disabled: !this.properties.enableAutoplay
                })
              ],
              isCollapsed: true
            },
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                PropertyPaneTextField('slidesPerGroup', {
                  label: strings.SlidesPerGroup,
                  value: '3'
                }),
                PropertyPaneTextField('spaceBetweenSlides', {
                  label: strings.SpaceBetweenSlides,
                  description: strings.InPixels,
                  value: '5'
                }),
                PropertyPaneToggle('enableGrabCursor', {
                  label: strings.EnableGrabCursor
                }),
                PropertyPaneToggle('enableLoop', {
                  label: strings.EnableLoop
                })
              ],
              isCollapsed: true
            }
          ]
        }
      ]
    };
  }

}
