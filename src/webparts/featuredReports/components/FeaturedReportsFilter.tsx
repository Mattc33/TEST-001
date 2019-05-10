import * as React from 'react';
import styles from './FeaturedReportsFilter.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { autobind, Dropdown, IDropdownOption, ActionButton, MarqueeSelection, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, mergeStyleSets } from 'office-ui-fabric-react';
import { IReportItem } from "../../../models";

export interface IFeaturedReportsFilterProps {
    segmentItems?: Array<string>;
    functionItems?: Array<string>;
    frequencyItems?: Array<string>;
    resultsPerPageItems?: Array<string>;

    onFilterChange(name: string, value: string): void;
    onPageSizeChange(value: string): void;
}

export interface IFeaturedReportsFilterState {
    segment?: IDropdownOption;
    function?: IDropdownOption;
    frequency?: IDropdownOption;
    resultsPerPage?: IDropdownOption;
}

export class FeaturedReportsFilter extends React.Component<IFeaturedReportsFilterProps, IFeaturedReportsFilterState> {

    constructor(props: IFeaturedReportsFilterProps) {
        super(props);

        this.state = {
            segment: null,
            function: null,
            frequency: null,
            resultsPerPage: null
        };
    }

    public render(): React.ReactElement<IFeaturedReportsFilterProps> {

        return (
            <div className={ styles.featuredReportsFilter }>
              <div className={ styles.grid } dir="ltr">
                <div className={ styles.filterarea }>
                  <div className={ styles.row }>
                    <div className={ styles.column2 }>Segment</div>
                    <div className={ styles.column2 }>Function</div>
                    <div className={ styles.column2 }>Frequency</div>
                    <div className={ styles.column4 }>&nbsp;</div>
                    <div className={ styles.column2 }>Results per page</div>
                  </div>
                  <div className={ styles.row }>
                    <div className={ styles.column2 }>
                      {this.getFilterDropdown("segment", this.props.segmentItems, this.state.segment)}
                    </div>
                    <div className={ styles.column2 }>
                      {this.getFilterDropdown("function", this.props.functionItems, this.state.function)}
                    </div>
                    <div className={ styles.column2 }>
                      {this.getFilterDropdown("frequency", this.props.frequencyItems, this.state.frequency)}
                    </div>
                    <div className={ styles.column4 }>
                      <ActionButton 
                        data-automation-id="ClearFilter" 
                        iconProps={{ iconName: 'ClearFilter' }} 
                        allowDisabledFocus={true} 
                        title="Reset all filters" 
                        onClick={this._resetFilters}>
                          Reset Filters
                      </ActionButton>
                    </div>
                    <div className={ styles.column2 }>
                      {this.getPageSizeDropdown("resultsPerPage", this.props.resultsPerPageItems, this.state.resultsPerPage)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }

    @autobind
    private getFilterDropdown(dropdownFor: string, values: Array<string>, selectedItem?: IDropdownOption): JSX.Element {
        const options: Array<IDropdownOption> = values.map((v: string): IDropdownOption => {
            return { key: v, text: v };
        });

        let defaultItem: IDropdownOption = { key: 'All', text: 'All' };
        options.unshift(defaultItem);
        
        return (
            <Dropdown
                selectedKey={selectedItem ? selectedItem.key : defaultItem.key}
                onChange={this._onFilterChange(dropdownFor)}
                placeholder="Select an option"
                options={options}
            />
        );
    }

    @autobind
    private getPageSizeDropdown(dropdownFor: string, values: Array<string>, selectedItem?: IDropdownOption): JSX.Element {
        const options: Array<IDropdownOption> = values.map((v: string): IDropdownOption => {
            return { key: v, text: v };
        });

        let defaultItem: IDropdownOption = options[0];

        return (
            <Dropdown
                selectedKey={selectedItem ? selectedItem.key : defaultItem.key}
                onChange={this._onPageSizeChange(dropdownFor)}
                placeholder="Select an option"
                options={options}
            />
        );
    }

    @autobind
    private _onFilterChange(dropdownFor: string) {
        return (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
            const state = { ...this.state };
            state[dropdownFor] = item;

            this.setState(state, () => {
              this.props.onFilterChange(dropdownFor, item.key as string);
            });
        };
    }

    @autobind
    private _onPageSizeChange(dropdownFor: string) {
        return (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
            const state = { ...this.state };
            state[dropdownFor] = item;

            this.setState(state, () => {
              this.props.onPageSizeChange(item.key as string);
            });
        };
    }

    @autobind
    private _resetFilters() {

    }
}
