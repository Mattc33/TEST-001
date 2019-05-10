import * as React from 'react';
import styles from './FeaturedReports.module.scss';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { Connect } from "../../../base";
import { FeaturedReportsContext } from "../store/FeaturedReportsStore";
import { IFeaturedReportsState } from "../state/IFeaturedReportsState";

import { FeaturedReportsFilter } from "./FeaturedReportsFilter";
import { FeaturedReportsList } from "./FeaturedReportsList";
import { autobind } from '@uifabric/utilities';

export interface IFeaturedReportsProps {
  description: string;
  context: WebPartContext;
  state: IFeaturedReportsState;
}

require("./ReportView.SPFix.css");

export class FeaturedReports extends React.Component<IFeaturedReportsProps, {}> {

  public shouldComponentUpdate(nextProps: IFeaturedReportsProps): boolean {
    // if (this.props.state !== nextProps.state)
    //   return false;

    return true;
  }

  public render(): React.ReactElement<IFeaturedReportsProps> {

    console.info('FeaturedReports::render', this.props.state);

    return (
      <div className={ styles.featuredReports }>
        <div className={ styles.grid } dir="ltr">
          <div className={ styles.row }>
            <div className={ `${styles.column12} ${styles.titleContainer}` }>
              <span className={ styles.title }>{this.props.state.webpartTitle}</span>
            </div>
          </div>
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <FeaturedReportsFilter
                segmentItems={['seg 1', 'seg 2', 'seg 3']}
                functionItems={['func 1', 'funq 2', 'funq 3']}
                frequencyItems={['freq 1', 'freq 2', 'freq 3']}
                resultsPerPageItems={['10','15','20','25']}
                onFilterChange={this.handleFilterChange}
                onPageSizeChange={this.handlePageSizeChange}
              />
            </div>
          </div>
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <FeaturedReportsList
                items={[]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private handleFilterChange(name: string, value: string) {
    this.props.state.actions.updateFilter(name, value);
  }

  @autobind
  private handlePageSizeChange(value: string) {
    this.props.state.actions.updatePageSize(Number.parseInt(value));
  }
}

const FeaturedReportsWithState = Connect(
  FeaturedReportsContext,
  FeaturedReports
);

export { FeaturedReportsWithState };