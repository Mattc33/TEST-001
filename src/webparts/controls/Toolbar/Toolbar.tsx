import * as React from 'react';
import {
    WebPartContext
} from '@microsoft/sp-webpart-base';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IReportItem } from "../../../models";

require("./toolbar.SPFix.css");

export interface IProfileFilter {
    filterName: string;
    filterValue: string;
    disabled: boolean;
    selected: boolean;
}

export interface IProfileFilterProps {
    filters: Array<IProfileFilter>;

    //onChange(e: React.FormEvent<HTMLElement>);
    onChange: Function;
}

const checkboxStyles = () => {
    return {
        root: {
            marginTop: '10px'
        }
    };
};

export const ProfileFilters: React.SFC<IProfileFilterProps> = props => {
    const filters = props.filters.map((f: IProfileFilter, index: number): JSX.Element => {
        return (
            <Checkbox
                label={f.filterName}
                defaultChecked={f.selected}
                disabled={f.disabled}
                onChange={props.onChange(f.filterName)}
                styles={checkboxStyles}
            />
        );
    });

    return (
        <React.Fragment>
            { filters }
        </React.Fragment>
    );
};

export interface IToolbarProps {
    context: WebPartContext;
    report: IReportItem;
    reportType: string;
    types: Array<string>;
    height: number;
    width: number;
    isFavorite: boolean;

    profileFilters: Array<IProfileFilter>;

    onClick(type: string, args?: any): void;
}

export interface IToolbarState {
    items: Array<ICommandBarItemProps>;
    height: number;
    width: number;

    profileFilters: Array<IProfileFilter>;
    showProfileFilter: boolean;
}

class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    private originalHeight: number;
    private originalWidth: number;

    constructor(props: IToolbarProps) {
        super(props);

        this.originalHeight = props.height;
        this.originalWidth = props.width;

        this.state = { 
            items:  [],
            height: props.height,
            width: props.width,

            profileFilters: props.profileFilters,
            showProfileFilter: false
        };
    }

    // public static getDerivedStateFromProps(props: IToolbarProps, state: IToolbarState) {
    //     if (props.height !== state.height || props.width !== state.width)  
    //     {
    //       state.height = props.height;
    //       state.width = props.width;
    //       return state;
    //     }
    
    //     return null;
    // }

    @autobind
    public render() { 
        const items = this.props.types.reduce<Array<ICommandBarItemProps>>((prev: Array<ICommandBarItemProps>, type: string): Array<ICommandBarItemProps> => {
            switch(type.toLowerCase()) {
                case "comment":
                    return prev.concat(this.renderComment());
                case "sizing":
                    return prev.concat(this.renderSizing());
                case "savecustom":
                    //return (this.isFavorite() ? prev : prev.concat(this.renderSaveCusomtView()));
                    return prev.concat(this.renderSaveCusomtView());
                case "story":
                    return prev.concat(this.renderStory());
                case "profilefilter":
                    return prev.concat(this.renderProfileFilters());
                case "share":
                    return prev.concat(this.renderShare());
                case "feedback":
                    return prev.concat(this.renderFeedback());
                case "fullscreen":
                    return prev.concat(this.renderFullScreen());
                case "learn":
                    return prev.concat(this.renderLearn());
                default:
                    return prev;
            }
        }, []);

        return (  
            <React.Fragment>
                { items && items.length > 0 && 
                    <React.Fragment>
                        <CommandBar items={items} />
                    
                        <Panel
                            isOpen={this.state.showProfileFilter}
                            type={PanelType.smallFixedFar}
                            onDismiss={this.closeProfileFilterPane}
                            headerText="Profile Filter"
                            closeButtonAriaLabel="Close"
                            onRenderFooterContent={this.renderProfileFilterFooterContent}>
                    
                            <ProfileFilters 
                                filters={this.state.profileFilters} 
                                onChange={this.handleProfileFilterChange} 
                            />

                        </Panel>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }

    @autobind
    private isFavorite(): boolean {
        if (this.props.reportType === "Tableau")
            return false;

        return this.props.isFavorite;
    }

    @autobind
    private handleProfileFilterChange(filterName: string) {
        return (e: React.FormEvent<HTMLElement>, checked: boolean) => {
            const filters = this.state.profileFilters.map((f: IProfileFilter) => {
                if (f.filterName === filterName)
                    f.selected = checked;

                return f;
            });

            this.setState(state => {
                return { ...state, ...{ "profileFilters": filters }};
            });
        };
    }

    @autobind
    private handlerSizingCommandClick(args: string) {
        const inc_dcr_value: number = 15;
        let { height, width, items } = this.state;
        switch(args) {
            case "contractVert":
                height -= inc_dcr_value;
                break;

            case "contractHorz":
                width -= inc_dcr_value;
                break;

            case "reset":
                height = this.originalHeight || 600;
                width = this.originalWidth || 800;
                break;

            case "expandHorz":
                width += inc_dcr_value;
                break;

            case "expandVert":
                height += inc_dcr_value;
                break;
        }

        this.setState(state => {
              return { ...state, ...{ height: height, width: width }};
            }, () => {
                this.props.onClick("sizing", { height: height, width: width });
            }
        );
    }

    @autobind
    private handlerProfileFilterClick(args: any) {
        this.toggleProfileFilterPane(true);
    }

    @autobind
    private closeProfileFilterPane() {
        this.toggleProfileFilterPane(false);
    }

    @autobind
    private toggleProfileFilterPane(state: boolean) {
        this.setState({ showProfileFilter: state });
    }

    @autobind
    private handleCommandClick(type: string, args?: any) {
        this.props.onClick(type, args);
    }

    @autobind
    private renderComment(): Array<ICommandBarItemProps> {
        return [{
            key: 'comment',
            name: 'Comment',
            iconProps: {
                iconName: 'Comment'
            },
            onClick: () => this.handleCommandClick('comment')
        }];
    }

    @autobind
    private renderLearn(): Array<ICommandBarItemProps> {
        return [{
            key: 'learn',
            name: 'Learn',
            iconProps: {
                iconName: 'Comment'
            },
            onClick: () => this.handleCommandClick('learn')
        }];
    }

    @autobind
    private renderSizing(): Array<ICommandBarItemProps> {
        let { height, width } = this.state;

        return [{
                key: 'contractVert',
                name: 'Reduce vertically',
                iconProps: {
                    iconName: 'ChevronUpSmall'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('contractVert')
            }, {
                key: 'contractHorz',
                name: 'Reduce horizontally',
                iconProps: {
                    iconName: 'ChevronLeftSmall'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('contractHorz')
            }, {
                key: 'reset',
                name: 'Reset sizes',
                iconProps: {
                    iconName: 'Refresh'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('reset')
            }, {
                key: 'sizeLabel',
                disabled: true,
                name: `${height}px H X ${width}px W`, // '1445px X 2535px'
            }, {
                key: 'expandHorz',
                name: 'Expand horizontally',
                iconProps: {
                    iconName: 'ChevronRightSmall'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('expandHorz')
            }, {
                key: 'expandVert',
                name: 'Expand vertically',
                iconProps: {
                    iconName: 'ChevronDownSmall'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('expandVert')
            }
        ];
    }

    @autobind
    private renderStory(): Array<ICommandBarItemProps> {
        return [{
            key: 'addToNewStory',
            name: 'Add to new story',
            iconProps: {
                iconName: 'BuildQueueNew'
            },
            onClick: () => this.handleCommandClick('addToNewStory')
        }, {
            key: 'addToExistingStory',
            name: 'Add to existing story',
            iconProps: {
                iconName: 'TripleColumnEdit'
            },
            onClick: () => this.handleCommandClick('addToNewStory')
        }];
    }

    @autobind
    private renderSaveCusomtView(): Array<ICommandBarItemProps> {
        return [{
            key: 'savecustom',
            name: 'Add view as favorite',
            disabled: this.isFavorite(),
            iconProps: {
                iconName: 'Heart'
            },
            onClick: () => this.handleCommandClick('savecustom')
        }];
    }

    @autobind
    private renderShare(): Array<ICommandBarItemProps> {
        const { report, context } = this.props;

        const reportUrl = `${context.pageContext.site.absoluteUrl}/SitePages/ViewReport.aspx?reportId=${report.Id}`;
        const subject = `${context.pageContext.user.displayName} shared a report: ${report.Title}`;
        const body = `%0d%0a${reportUrl}%0d%0a%0d%0a${report.SVPVisualizationDescription}%0d%0a%0d%0a`;

        return [{
            key: 'share',
            name: 'Share',
            iconProps: {
                iconName: 'Share'
            },
            href: `mailto:?Subject=${subject}&body=${body}`
        }];
    }

    @autobind
    private renderFavorite(): Array<ICommandBarItemProps> {
        return [{
            key: 'addFavorite',
            name: 'Add favorite',
            iconProps: {
                iconName: 'AddFavorite'
            },
            onClick: () => this.handleCommandClick('addFavorite')
        }];
    }

    @autobind
    private renderFeedback(): Array<ICommandBarItemProps> {
        const { report, context } = this.props;

        const to = (report.SVPVisualizationOwner) ? report.SVPVisualizationOwner.EMail : '';
        const reportUrl = `${context.pageContext.site.absoluteUrl}/SitePages/ViewReport.aspx?reportId=${report.Id}`;
        const subject = `${context.pageContext.user.displayName} sent feedback for report: ${report.Title}`;
        const body = `%0d%0a${reportUrl}%0d%0a%0d%0aFeedback:%0d%0a%0d%0a`;

        return [{
            key: 'sendFeedback',
            name: 'Send feedback',
            iconProps: {
                iconName: 'Feedback'
            },
            href: `mailto:${to}?subject=${subject}&body=${body}`
        }];
    }

    @autobind
    private renderFullScreen(): Array<ICommandBarItemProps> {
        return [{
            key: 'fullScreen',
            name: 'Maximize',
            iconProps: {
                iconName: 'FullScreen'
            },
            iconOnly: true,
            onClick: () => this.handleCommandClick('sendFeedback')
        }];
    }

    @autobind
    private renderProfileFilters(): Array<ICommandBarItemProps> {
        return [{
            key: 'profilefilter',
            name: 'Apply profile filters',
            iconProps: {
                iconName: 'ProfileSearch'
            },
            iconOnly: true,
            onClick: () => this.handlerProfileFilterClick('profilefilter')
        }];
    }

    @autobind
    private renderProfileFilterFooterContent(): JSX.Element {
        return (
            <div>
                <PrimaryButton onClick={this.closeProfileFilterPane} style={{ marginRight: '8px' }}>
                    Apply
                </PrimaryButton>
                <DefaultButton onClick={this.closeProfileFilterPane}>Cancel</DefaultButton>
            </div>
        );
    }
}
 
export { Toolbar };
