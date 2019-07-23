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
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  sp
} from '@pnp/sp';
import { Environment, EnvironmentType} from '@microsoft/sp-core-library';

import { Runtime, SiteKey, RuntimeCallback } from '../../services/utils';
import { initializeIcons } from '@uifabric/icons';
import * as strings from 'MeetingBookDetailsWebPartStrings';

import { 
  MeetingBookDetailsProvider,
  IMeetingBookDetailsProviderProps 
} from './meeting-book-details-provider';
import { EVENT_FORM_TYPE, CALENDAR_SERVICE } from '../../models';

export interface IMeetingBookDetailsWebPartProps {

  calendarFormView: EVENT_FORM_TYPE;
  calendarDataService: CALENDAR_SERVICE;

  artistTermSetName: string;
  artistTermSetId: string;

  categoryTermSetName: string;
  categoryTermSetId: string;

  hubSiteUrl: string;

}

export default class MeetingBookDetailsWebPart extends BaseClientSideWebPart<IMeetingBookDetailsWebPartProps> {

  private _runtime: Runtime;

  public render(): void {

    const {
      calendarEventForm,
      calendarService,
      artistTermSetId,
      artistTermSetName,
      categoryTermSetId,
      categoryTermSetName
    } = this._runtime.SiteOptions;
    
    const providerElement: React.ReactElement<IMeetingBookDetailsProviderProps> = React.createElement(
      MeetingBookDetailsProvider,
      {
        siteOptions: this._runtime.SiteOptions,
        context: this.context,
        calendarFormView: calendarEventForm || this.properties.calendarFormView,
        calendarDataServiceName: calendarService || this.properties.calendarDataService,
        artistTermSetName: artistTermSetName || this.properties.artistTermSetName,
        artistTermSetId: artistTermSetId || this.properties.artistTermSetId,
        categoryTermSetName: categoryTermSetName || this.properties.categoryTermSetName,
        categoryTermSetId: categoryTermSetId || this.properties.categoryTermSetId,
        hubUrl: this.properties.hubSiteUrl
      } as IMeetingBookDetailsProviderProps
    );

    ReactDom.render(providerElement, this.domElement);
    
  }

  protected async onInit(): Promise<void> {

    try {

      this._runtime = new Runtime(Environment, window);

      const fontAwesome = 'https://use.fontawesome.com/releases/v5.0.8/css/all.css';
      SPComponentLoader
          .loadCss(fontAwesome);

      const isProdEnvironment: boolean = this._runtime.isProdEnvironment();

      await this._runtime
        .runWhenDev(this.bootstrapDevelopment)
        .runWhenModernPage(this.bootstrapModern)
        .runWhen(()=> true, this.bootstrapEnv)
        .runWhen(() => isProdEnvironment, this.bootstrapProd)
        .run();

      if (this._runtime.isProdEnvironment()) {

      }

      sp.setup({
        spfxContext: this.context
      });

      initializeIcons();

      return Promise.resolve();

    } catch(err) {
      return Promise.reject(err);
    }

  }

  @autobind
  private async bootstrapProd(siteKey: SiteKey, env: Environment, window: Window) {

    const cssUrl = `${this.context.pageContext.site.absoluteUrl}/SVPSiteAssets/css/vp-${siteKey}-portal.css`;
    SPComponentLoader.loadCss(cssUrl);
  }

  @autobind
  private async bootstrapEnv(siteKey: SiteKey, env: Environment, window: Window) {

    const spSiteUrl = this.context.pageContext.site.absoluteUrl;
    await this.loadSPJSOMScripts(spSiteUrl);

    await this.verifySPLibsLoaded(10);

  }

  private async loadSPJSOMScripts(siteColUrl: string): Promise<void> {

    try {      
      if (!(window as any).initJsLoaded) {
        await SPComponentLoader.loadScript(siteColUrl + '/_layouts/15/init.js', {
          globalExportsName: '$_global_init'
        });
      }

      await SPComponentLoader.loadScript(siteColUrl + '/_layouts/15/MicrosoftAjax.js', {
           globalExportsName: 'Sys'
      });

      if ((typeof SP === 'undefined') ||
          (SP && typeof (SP as any).ClientRuntimeContext !== 'function')) {
        await SPComponentLoader.loadScript(siteColUrl + '/_layouts/15/SP.Runtime.js', {
          globalExportsName: 'SP'
        });
      }

      if ((typeof SP === 'undefined') ||
          (SP && typeof (SP as any).ClientContext !== 'function')) {
        await SPComponentLoader.loadScript(siteColUrl + '/_layouts/15/SP.js', {
          globalExportsName: 'SP'
        });
      }

      if ((typeof SP === 'undefined') ||
          (SP && typeof SP.Taxonomy === 'undefined')) {
        await SPComponentLoader.loadScript(siteColUrl + '/_layouts/15/SP.taxonomy.js', {
          globalExportsName: 'SP'
        });
      }

    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve();

  }
  
  public async verifySPLibsLoaded(maxRetry: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      for(let i = 0; i < maxRetry; i++) {
        if (typeof SP !== 'undefined' && typeof SP.Taxonomy !== 'undefined') {
          resolve();
          return;
        } else {
          await this.delay(50);
        } 
      }
      console.error("**** Unable to load JSOM libraries ****");
      resolve();
    });
  }

  private async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
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
              groupName: 'General Calendar Settings',
              groupFields: [
                PropertyPaneDropdown('calendarFormView', {
                  label: 'Event Form View',
                  options: [
                    { key: 'warner-bros', text: 'Warner Bros' },
                    { key: 'atlantic', text: 'Atlantic' },
                    { key: 'elektra', text: 'Elektra'},
                    { key: 'warner-chappell', text: 'Warner/Chappell'}
                  ]
                }),
                PropertyPaneDropdown('calendarDataService', {
                  label: 'Data Service',
                  options: [
                    { key: 'wcm-artist-calendar-service', text: 'wcm-artist-calendar-service' },
                    { key: 'artist-calendar-service', text: 'artist-calendar-service' },
                  ]
                }),
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('artistTermSetName', {
                  label: 'Artist Term Set Name',
                  multiline: false,
                  resizable: false
                }),
                PropertyPaneTextField('artistTermSetId', {
                  label: 'Artist Term Set Id (Guid)',
                  multiline: false,
                  resizable: false
                })
              ]
            },
            {
              groupName: 'Event Category Term Set',
              groupFields: [
                PropertyPaneTextField('categoryTermSetName', {
                  label: 'Event Category Term Set Name',
                  multiline: false,
                  resizable: false
                }),
                PropertyPaneTextField('categoryTermSetId', {
                  label: 'Event Category Term Set Id (Guid)',
                  multiline: false,
                  resizable: false
                })
              ]
            },
            {
              groupName: 'Hub Site',
              groupFields: [
                PropertyPaneTextField('hubSiteUrl', {
                  label: 'Hub Site Url',
                  multiline: false,
                  resizable: false
                })
              ]
            }
          ]
        }
      ]
    };
  }

  @autobind
  private bootstrapDevelopment(siteKey: SiteKey, env: typeof Environment, window: Window, css: Array<string>) {

    console.log('MeetingBookDetails running in dev...');

    css.forEach(SPComponentLoader.loadCss);
    

  }

  @autobind
  private bootstrapModern(siteKey: SiteKey, env: typeof Environment, window: Window, css: Array<string>) {

    // No-op for demo purposes.

  }
}