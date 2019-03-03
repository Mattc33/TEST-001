import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, ApplicationCustomizerContext
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'DataMarketplaceRendererApplicationCustomizerStrings';


import { sp } from "@pnp/sp";
import { ResultService, ISearchEvent } from '../../services/ResultService/ResultService';
import IResultService from '../../services/ResultService/IResultService';
import SearchResult from './SearchResult/SearchResults';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { autobind } from '@uifabric/utilities';

const LOG_SOURCE: string = 'DataMarketplaceRendererApplicationCustomizer';

export interface IDataMarketplaceRendererApplicationCustomizerProperties {
  testMessage: string;
}

export default class DataMarketplaceRendererApplicationCustomizer
  extends BaseApplicationCustomizer<IDataMarketplaceRendererApplicationCustomizerProperties> {

  private _resultService: IResultService;

  @override
  public onInit(): Promise<void> {
    this._resultService = new ResultService();
    this._resultService.registerRenderer(this.componentId, 'Data Marketplace Renderer', 'QueryList',
      this.onChangeHappened, ['Subheader']);
    sp.setup({
      spfxContext: this.context
    });

    return Promise.resolve();
  }

  @autobind
  public onChangeHappened(e: ISearchEvent) {
    const subheaderFieldName = e.customTemplateFieldValues[0].searchProperty && e.customTemplateFieldValues[0].searchProperty.length > 0 ? e.customTemplateFieldValues[0].searchProperty : 'Path';
    const resultDisplay = React.createElement(SearchResult, {
      searchResults: e.results,
      componentId: e.rendererId,
      subheaderFieldName: subheaderFieldName,
      context: this.context
    });
    let node = document.getElementById(e.mountNode);
    if (node) {
      ReactDOM.render(resultDisplay, node);
    }
  }
}
