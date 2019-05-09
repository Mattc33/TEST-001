import * as React from 'react';
import styles from './FeaturedReports.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { Connect } from "../../../base";
import { FeaturedReportsContext } from "../store/FeaturedReportsStore";

import { FeaturedReportsFilter } from "./FeaturedReportsFilter";

export interface IFeaturedReportsProps {
  description: string;
}

require("./ReportView.SPFix.css");

export class FeaturedReports extends React.Component<IFeaturedReportsProps, {}> {
  public render(): React.ReactElement<IFeaturedReportsProps> {
    return (
      <div className={ styles.featuredReports }>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
              <FeaturedReportsFilter
                segmentItems={['seg 1', 'seg 2', 'seg 3']}
                functionItems={['func 1', 'funq 2', 'funq 3']}
                frequencyItems={['freq 1', 'freq 2', 'freq 3']}
                resultsPerPageItems={['10','15','20','25']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const FeaturedReportsWithState = Connect(
  FeaturedReportsContext,
  FeaturedReports
);

export { FeaturedReportsWithState };