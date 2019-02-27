import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'DataMarketplaceRendererApplicationCustomizerStrings';


import { ResultService, ISearchEvent } from '../../services/ResultService/ResultService';
import IResultService from '../../services/ResultService/IResultService';
import SearchResult from './SearchResult/SearchResults';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

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
        this.onChangeHappened.bind(this);
        this._resultService.registerRenderer(this.componentId, 'Data Marketplace Renderer', 'QueryList', this.onChangeHappened, ['Subheader']);
        return Promise.resolve();
    }

    public onChangeHappened(e: ISearchEvent) {
        const subheaderFieldName = e.customTemplateFieldValues[0].searchProperty && e.customTemplateFieldValues[0].searchProperty.length > 0 ? e.customTemplateFieldValues[0].searchProperty : 'Path';
        const resultDisplay = React.createElement(SearchResult, {
            searchResults: e.results,
            componentId: e.rendererId,
            subheaderFieldName: subheaderFieldName,
        });
        let node = document.getElementById(e.mountNode);
        if (node) {
            ReactDOM.render(resultDisplay, node);
        }
    }
}
