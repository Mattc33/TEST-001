import * as React from 'react';
import ISearchResultProps from './ISearchResultProps';
import styles from './SearchResult.module.scss';
import { PersonaCoin } from 'office-ui-fabric-react/lib/PersonaCoin';
import * as moment from 'moment';
import { ISearchResult } from '../../../models/ISearchResult';
import ResultTile from './ResultTile';
import { Link } from "office-ui-fabric-react";

export default class SearchResult extends React.Component<ISearchResultProps, {}> {
  public render() {

    console.log("Search Results: ", this.props.searchResults);
    const resultTiles: JSX.Element[] = this.props.searchResults.RelevantResults.map((result: ISearchResult) => (
      <ResultTile key={result.ListItemId} result={result} currentUser={this.props.currentUser} />
    ));

    return (
      <div className="template_root">
        <div className="template_defaultCard">
          <div className="template_resultCount">
            <label className="ms-fontWeight-semibold">{this.props.searchResults.PaginationInformation.TotalRows} Results</label>
            <span> (</span><Link href={window.location.href}>Click to reset search</Link><span>)</span>
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