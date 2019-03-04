import * as React from 'react';
import ISearchResultProps from './ISearchResultProps';
import styles from './SearchResult.module.scss';
import { PersonaCoin } from 'office-ui-fabric-react/lib/PersonaCoin';
import * as moment from 'moment';
import { ISearchResult } from '../../../models/ISearchResult';
import ResultTile from './ResultTile';

export default class SearchResult extends React.Component<ISearchResultProps, {}> {
  public render() {

    let resultTiles: JSX.Element[] = this.props.searchResults.RelevantResults.map((result: ISearchResult) => {
      return (
        <ResultTile result={result} />
      );
    });

    return (
      <div className="template_root">
        <div className="template_defaultCard">
          <div className="template_resultCount">
            <label className="ms-fontWeight-semibold">{this.props.searchResults.TotalRows} results</label>
          </div>
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <ul className={styles.resultContainer}>
                {resultTiles}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}