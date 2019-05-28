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

interface MyWindow extends Window {
  parseInt(): number;
}

declare var window: MyWindow;

export class FeaturedReports extends React.Component<IFeaturedReportsProps, {}> {
  private reportFilterRef: FeaturedReportsFilter;

  public shouldComponentUpdate(nextProps: IFeaturedReportsProps): boolean {
    // if (this.props.state !== nextProps.state)
    //   return false;

    return true;
  }

  public componentDidMount() {
    this.props.state.actions.loadFilters();
    this.props.state.actions.loadReports();
  }

  public render(): React.ReactElement<IFeaturedReportsProps> {

    const props = this.props.state;
    const currentPage = (props.paging && props.paging.currentPage)
      ? props.paging.currentPage : 1;
    const hasNext = (props.paging && props.paging.hasNext)
      ? props.paging.hasNext : false;

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
                ref={arg => this.reportFilterRef = arg}
                loading={props.loadingFilters}
                segmentItems={props.filterValues.segments}
                //selectedSegment={props.filter.segment}
                functionItems={props.filterValues.functions}
                //selectedFunction={props.filter.function}
                frequencyItems={props.filterValues.frequencies}
                //selectedFrequency={props.filter.frequency}
                resultsPerPageItems={props.filterValues.pageSizes}
                onFilterReset={this.handleOnFilterReset}
                onFilterChange={this.handleOnFilterChange}
                onPageSizeChange={this.handleOnPageSizeChange}
              />
            </div>
          </div>
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <FeaturedReportsList
                webUrl={props.context.pageContext.site.absoluteUrl}
                loading={props.loadingReports}
                items={props.reports}
                currentPage={currentPage}
                hasNext={hasNext}
                onFetchPage={this.handleOnFetchPage}
                onSort={this.handleOnSort}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private handleOnFilterReset() {
    this.props.state.actions.resetFilters();
    if (this.reportFilterRef)
      this.reportFilterRef.resetFilters();
  }


  @autobind
  private handleOnFilterChange(name: string, value: string) {
    this.props.state.actions.updateFilter(name, value);
  }

  @autobind
  private handleOnPageSizeChange(value: string) {
    if (Number.parseInt === undefined) {
      Number.parseInt = window.parseInt;
    }
    this.props.state.actions.updatePageSize(Number.parseInt(value));
  }

  @autobind
  private handleOnSort(sortField: string, isAsc: boolean) {
    this.props.state.actions.updateSort(sortField, isAsc);
  }

  @autobind
  private handleOnFetchPage(direction: string) {
    this.props.state.actions.updateFetchPage(direction);
  }
}

const FeaturedReportsWithState = Connect(
  FeaturedReportsContext,
  FeaturedReports
);

export { FeaturedReportsWithState };