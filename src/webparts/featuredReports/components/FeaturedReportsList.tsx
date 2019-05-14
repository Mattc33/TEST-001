import * as React from 'react';
import styles from './FeaturedReportsList.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { autobind, Dropdown, IDropdownOption, ActionButton, MarqueeSelection, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, mergeStyleSets } from 'office-ui-fabric-react';
import { IReportItem } from "../../../models";
import { Button, Spinner, SpinnerSize, MessageBar, Link } from 'office-ui-fabric-react';

export interface IFeaturedReportsListProps {
  loading: boolean;
  items: Array<IReportItem>;

  currentPage: number;
  hasNext: boolean;
  webUrl: string;

  onFetchPage(director: string);
  onSort(sortField: string, isAsc: boolean);
}

export interface IFeaturedReportsListState {
    columns: IColumn[];
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
  
export class FeaturedReportsList extends React.Component<IFeaturedReportsListProps, IFeaturedReportsListState> {
    private _columns: Array<IColumn>;
    private _selection: Selection;

    constructor(props: IFeaturedReportsListProps) {
        super(props);

        this.state = {
          columns: [
            {
              key: 'docIcon',
              name: '',
              fieldName: 'Title',
              className: classNames.fileIconCell,
              iconClassName: classNames.fileIconHeaderIcon,
              iconName: 'Page',
              isIconOnly: true,
              minWidth: 16,
              maxWidth: 16,
              //onColumnClick: this._onColumnClick,
              onRender: (item: IReportItem) => {
                const imageUrl = (item.SVPVisualizationImage)
                  ? item.SVPVisualizationImage
                  : `${props.webUrl}/ReportImages/Icons/Logo_ReportDefault.png`;

                return <img src={imageUrl} className={classNames.fileIconImg} alt={item.Title} />;
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
              onRender: (item: IReportItem) => {
                const reportUrl = `${props.webUrl}/SitePages/ViewReport.aspx?reportId=${item.Id}`;
                return <Link href={reportUrl}>{item.Title}</Link>;
              },
              isPadded: true
            },
            {
              key: 'lastModified',
              name: 'Last Modified',
              fieldName: 'SVPLastUpdated',
              minWidth: 70,
              maxWidth: 90,
              isResizable: true,
              isSorted: false,
              isSortedDescending: true,
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
              isSorted: false,
              isSortedDescending: true,
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
              isSorted: false,
              isSortedDescending: true,
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
                isSorted: false,
                isSortedDescending: true,
                isCollapsible: true,
                data: 'string',
                onColumnClick: this._onColumnClick,
                onRender: (item: IReportItem) => {
                  return <span>{item.SVPMetadata3}</span>;
                }
              }
          ]
        };
          
        this._selection = new Selection({
            onSelectionChanged: () => { }
        });
    }

    public render(): React.ReactElement<IFeaturedReportsListProps> {

        return (
            <div className={ styles.featuredReportsList }>
              <div className={ styles.grid } dir="ltr">
                { this.props.loading && this.renderBusy() }
                { !this.props.loading && this.props.items.length > 0 && this.renderReports() }
                { !this.props.loading && this.props.items.length === 0 && this.renderNoReports() }
              </div>
            </div>
        );
    }

    @autobind
    private renderNoReports() {
      return (
        <div className={ styles.row }>
          <div className={ styles.column12 }>
            <MessageBar>
              No report found matching your criteria.
            </MessageBar>
          </div>
        </div>
      );
    }

    @autobind
    private renderBusy(): JSX.Element {
        return (
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <Spinner size={SpinnerSize.medium} label="Loading reports..." labelPosition="right"></Spinner>
            </div>
          </div>
        );
    }

    @autobind
    private renderReports(): JSX.Element {
      return (
        <React.Fragment>
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <MarqueeSelection selection={this._selection}>
                <DetailsList
                  items={this.props.items}
                  compact={false}
                  columns={this.state.columns}
                  selectionMode={SelectionMode.none}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                  selection={this._selection}
                  selectionPreservedOnEmptyClick={true}
                  enterModalSelectionOnTouch={true}
                  ariaLabelForSelectionColumn="Toggle selection"
                  ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                />
              </MarqueeSelection>
            </div>
          </div>
          <div className={ styles.row }>
            <div className={ styles.column12 }>
              <Button disabled={this.props.currentPage <= 1} onClick={() => this.props.onFetchPage("prev")}>Prev</Button>
              <Button disabled={!this.props.hasNext} onClick={() => this.props.onFetchPage("next")}>Next</Button>
            </div>
          </div>
        </React.Fragment>
      );
    }

    @autobind
    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn): void {
        const { columns } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
          if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending;
            currColumn.isSorted = true;
          } else {
            newCol.isSorted = false;
            newCol.isSortedDescending = true;
          }
        });

        this.setState({
          columns: newColumns
        }, () => {
          this.props.onSort(currColumn.fieldName, !currColumn.isSortedDescending);
        });
    }
}
