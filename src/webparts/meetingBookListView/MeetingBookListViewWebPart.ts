import 'core-js/es6/object';
import 'core-js/es6/array';
import 'es6-map/implement';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  sp
} from '@pnp/sp';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import { Runtime, SiteKey, RuntimeCallback } from '../../services/utils';
import { initializeIcons } from '@uifabric/icons';
import * as strings from 'MeetingBookListViewWebPartStrings';

import { 
  MeetingBookListViewProvider,
  IMeetingBookListViewProviderProps 
} from './meeting-book-list-view-provider';

export interface IMeetingBookListViewWebPartProps {

}

export default class MeetingBookListViewWebPart extends BaseClientSideWebPart<IMeetingBookListViewWebPartProps> {

  private _runtime: Runtime;


  public render(): void {
    const element: React.ReactElement<IMeetingBookListViewProviderProps > = React.createElement(
      MeetingBookListViewProvider,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {

    try {

      this._runtime = new Runtime(Environment, window);

      const isProdEnvironment: boolean = this._runtime.isProdEnvironment();

      await this._runtime
        .runWhenDev(this.bootstrapDev)
        .runWhen(() => isProdEnvironment, this.bootstrapProd)
        .run();

      sp.setup({
        spfxContext: this.context
      });

      initializeIcons();
      
      return Promise.resolve();

    } catch (err) {
      return Promise.reject(err);
    }

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
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  @autobind
  private async bootstrapProd(siteKey: SiteKey, env: Environment, window: Window) {

    const cssUrl = `${this.context.pageContext.site.absoluteUrl}/SVPSiteAssets/css/vp-${siteKey}-portal.css`;
    SPComponentLoader.loadCss(cssUrl);
  }

  @autobind
  private bootstrapDev(siteKey: SiteKey, env: typeof Environment, window: Window, css: Array<string>) {

    css.forEach(SPComponentLoader.loadCss);
      
  }

}
