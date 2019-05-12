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
}

export interface IFeaturedReportsFilterState {
    segment?: IDropdownOption;
    function?: IDropdownOption;
    frequency?: IDropdownOption;
    resultsPerPage?: IDropdownOption;
}

const classNames = mergeStyleSets({
    fileIconHeaderIcon: {
      padding: 0,
      fontSize: '16px'
    },
    fileIconCell: {
      textAlign: 'center',
      selectors: {
        '&:before': {
          content: '.',
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '100%',
          width: '0px',
          visibility: 'hidden'
        }
      }
    },
    fileIconImg: {
      verticalAlign: 'middle',
      maxHeight: '16px',
      maxWidth: '16px'
    },
    controlWrapper: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    exampleToggle: {
      display: 'inline-block',
      marginBottom: '10px',
      marginRight: '30px'
    },
    selectionDetails: {
      marginBottom: '20px'
    }
  });
  
export class FeaturedReportsFilter extends React.Component<IFeaturedReportsFilterProps, IFeaturedReportsFilterState> {
    private _columns: Array<IColumn>;
    private _selection: Selection;

    constructor(props: IFeaturedReportsFilterProps) {
        super(props);

        this._columns = [
            {
              key: 'docIcon',
              name: '',
              className: classNames.fileIconCell,
              iconClassName: classNames.fileIconHeaderIcon,
              iconName: 'Page',
              isIconOnly: true,
              fieldName: 'Title',
              minWidth: 16,
              maxWidth: 16,
              onColumnClick: this._onColumnClick,
              onRender: (item: IReportItem) => {
                return <img src={item.IconName} className={classNames.fileIconImg} alt={item.Title} />;
              }
            },
            {
              key: 'fileName    ',
              name: 'Name',
              fieldName: 'Title',
              minWidth: 210,
              maxWidth: 350,
              isRowHeader: true,
              isResizable: true,
              isSorted: true,
              isSortedDescending: false,
              sortAscendingAriaLabel: 'Sorted A to Z',
              sortDescendingAriaLabel: 'Sorted Z to A',
              onColumnClick: this._onColumnClick,
              data: 'string',
              isPadded: true
            },
            {
              key: 'lastModified',
              name: 'Last Modified',
              fieldName: 'Modified',
              minWidth: 70,
              maxWidth: 90,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'number',
              onRender: (item: IReportItem) => {
                return <span>{item.ModifiedFormatted}</span>;
              },
              isPadded: true
            },
            {
              key: 'segment',
              name: 'Segment',
              fieldName: 'SVPMetadata1',
              minWidth: 70,
              maxWidth: 90,
              isResizable: true,
              isCollapsible: true,
              data: 'string',
              onColumnClick: this._onColumnClick,
              onRender: (item: IReportItem) => {
                return <span>{item.SVPMetadata1}</span>;
              },
              isPadded: true
            },
            {
              key: 'function',
              name: 'Function',
              fieldName: 'SVPMetadata2',
              minWidth: 70,
              maxWidth: 90,
              isResizable: true,
              isCollapsible: true,
              data: 'string',
              onColumnClick: this._onColumnClick,
              onRender: (item: IReportItem) => {
                return <span>{item.SVPMetadata2}</span>;
              }
            },
            {
                key: 'frequency',
                name: 'Frequency',
                fieldName: 'SVPMetadata3',
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                isCollapsible: true,
                data: 'string',
                onColumnClick: this._onColumnClick,
                onRender: (item: IReportItem) => {
                  return <span>{item.SVPMetadata3}</span>;
                }
              }
          ];
          
        this._selection = new Selection({
            onSelectionChanged: () => {
            //   this.setState({
            //     selectionDetails: this._getSelectionDetails()
            //   });
            }
        });
      
        this.state = {
            segment: null,
            function: null,
            frequency: null,
            resultsPerPage: null
        };
    }

    public render(): React.ReactElement<IFeaturedReportsFilterProps> {

        const items = this._generateDocuments();

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
                            {this.getDropdown("segment", this.props.segmentItems, this.state.segment)}
                        </div>
                        <div className={ styles.column2 }>
                            {this.getDropdown("function", this.props.functionItems, this.state.function)}
                        </div>
                        <div className={ styles.column2 }>
                            {this.getDropdown("frequency", this.props.frequencyItems, this.state.frequency)}
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
                            {this.getDropdown("resultsPerPage", this.props.resultsPerPageItems, this.state.resultsPerPage)}
                        </div>
                    </div>

                    </div>
                    
                    <div className={ styles.row }>
                        <div className={ styles.column12 }>
                            <MarqueeSelection selection={this._selection}>
                                <DetailsList
                                    items={items}
                                    compact={false}
                                    columns={this._columns}
                                    selectionMode={SelectionMode.none}
                                    setKey="set"
                                    layoutMode={DetailsListLayoutMode.justified}
                                    isHeaderVisible={true}
                                    selection={this._selection}
                                    selectionPreservedOnEmptyClick={true}
                                    //onItemInvoked={this._onItemInvoked}
                                    enterModalSelectionOnTouch={true}
                                    ariaLabelForSelectionColumn="Toggle selection"
                                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                                />
                            </MarqueeSelection>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    private getDropdown(dropdownFor: string, values: Array<string>, selectedItem?: IDropdownOption): JSX.Element {
        const options: Array<IDropdownOption> = values.map((v: string): IDropdownOption => {
            return { key: v, text: v };
        });

        let defaultItem: IDropdownOption;

        if (dropdownFor !== 'resultsPerPage') {
            defaultItem = { key: 'All', text: 'All' };
            options.unshift(defaultItem);
        }
        else {
            defaultItem = options[0];
        }
        

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
    private _onFilterChange(dropdownFor: string) {
        return (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
            const state = { ...this.state };
            state[dropdownFor] = item;

            this.setState(state);
        };
    }

    @autobind
    private _resetFilters() {

    }

    @autobind
    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn): void {
        // const { columns, items } = this.state;
        // const newColumns: IColumn[] = columns.slice();
        // const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        // newColumns.forEach((newCol: IColumn) => {
        //   if (newCol === currColumn) {
        //     currColumn.isSortedDescending = !currColumn.isSortedDescending;
        //     currColumn.isSorted = true;
        //   } else {
        //     newCol.isSorted = false;
        //     newCol.isSortedDescending = true;
        //   }
        // });
        // const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        // this.setState({
        //   columns: newColumns,
        //   items: newItems
        // });
    }

    private _generateDocuments() {
        const items: IReportItem[] = [];
        
        items.push({
          Title: "Monthly Reporting Suite (MRS)",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Financial Performance",
          SVPMetadata3: "Monthly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Cost Per Pirce",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Human Resources",
          SVPMetadata3: "Monthly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Service Level",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Operations",
          SVPMetadata3: "Quaterly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Revenue Management Dashboard",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Sales",
          SVPMetadata3: "Monthly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Corporate Scorecard",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Category Management",
          SVPMetadata3: "Monthly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Strategic Territory Planning",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Sales",
          SVPMetadata3: "Quaterly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        items.push({
          Title: "Monthly Business Review (MBR)",
          IconName: (this._randomFileIcon()).url,
          SVPMetadata1: "USBL",
          SVPMetadata2: "Financial Performance",
          SVPMetadata3: "Weekly",
          ModifiedFormatted: (this._randomDate(new Date(2012, 0, 1), new Date())).dateFormatted,
          ModifiedNumber: (this._randomDate(new Date(2012, 0, 1), new Date())).value
        });

        return items;
      }
      
      private _randomDate(start: Date, end: Date): { value: number; dateFormatted: string } {
        const date: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return {
          value: date.valueOf(),
          dateFormatted: date.toLocaleDateString()
        };
      }
      
      private FILE_ICONS: { name: string }[] = [
        { name: 'accdb' },
        { name: 'csv' },
        { name: 'docx' },
        { name: 'dotx' },
        { name: 'mpt' },
        { name: 'odt' },
        { name: 'one' },
        { name: 'onepkg' },
        { name: 'onetoc' },
        { name: 'pptx' },
        { name: 'pub' },
        { name: 'vsdx' },
        { name: 'xls' },
        { name: 'xlsx' },
        { name: 'xsn' }
      ];
      
      private _randomFileIcon(): { docType: string; url: string } {
        const docType: string = this.FILE_ICONS[Math.floor(Math.random() * this.FILE_ICONS.length)].name;
        return {
          docType,
          url: `https://static2.sharepointonline.com/files/fabric/assets/brand-icons/document/svg/${docType}_16x1.svg`
        };
      }
      
      private LOREM_IPSUM = (
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
        'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
        'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt '
      ).split(' ');

      private loremIndex = 0;
      private _lorem(wordCount: number): string {
        const startIndex = this.loremIndex + wordCount > this.LOREM_IPSUM.length ? 0 : this.loremIndex;
        this.loremIndex = startIndex + wordCount;
        return this.LOREM_IPSUM.slice(startIndex, this.loremIndex).join(' ');
      }
    
}
