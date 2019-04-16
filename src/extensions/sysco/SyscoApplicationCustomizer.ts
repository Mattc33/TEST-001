import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SyscoApplicationCustomizerStrings';

import styles from '../syscostyles.module.scss';

require('../syscobigstyles.module.scss');

const LOG_SOURCE: string = 'SyscoApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISyscoApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SyscoApplicationCustomizer
  extends BaseApplicationCustomizer<ISyscoApplicationCustomizerProperties> {

    private headerplaceholder: PlaceholderContent;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    console.log("Available Placeholders: ", this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(","));

    if(!this.headerplaceholder){
      this.headerplaceholder =
      this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { //on dispose method
        });
        
        this.headerplaceholder.domElement.innerHTML = `
        <div class="${styles.firstclass}">
        test
        </div>`;
    }

    return Promise.resolve<void>();
  }
}
