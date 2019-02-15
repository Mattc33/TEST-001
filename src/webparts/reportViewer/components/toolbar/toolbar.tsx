import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';


export interface IToolbarProps {
  types: Array<string>;
  height: number;
  width: number;

  onClick(type: string, args?: any): void;
}

export interface IToolbarState {
    items: Array<ICommandBarItemProps>;
    height: number;
    width: number;

    showProfileFilter: boolean;
}

class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    private originalHeight: number;
    private originalWidth: number;

    constructor(props) {
        super(props);

        this.originalHeight = this.props.height;
        this.originalWidth = this.props.width;

        this.state = { 
            items:  [],
            height: this.props.height,
            width: this.props.width,
            showProfileFilter: false
        };
    }

    @autobind
    public render() { 
        const items = this.props.types.reduce<Array<ICommandBarItemProps>>((prev: Array<ICommandBarItemProps>, type: string): Array<ICommandBarItemProps> => {
            switch(type.toLowerCase()) {
                case "sizing":
                    return prev.concat(this.renderSizing());
                case "savecustom":
                    return prev.concat(this.renderSaveCusomtView());
                case "story":
                    return prev.concat(this.renderStory());
                case "profilefilter":
                    return prev.concat(this.renderProfileFilters());
                case "feedback":
                    return prev.concat(this.renderFeedback());
                case "fullscreen":
                    return prev.concat(this.renderFullScreen());
                default:
                    return prev;
            }
        }, []);

        return (  
            <React.Fragment>
                <CommandBar items={items} />
                <Panel
                    isOpen={this.state.showProfileFilter}
                    type={PanelType.smallFixedFar}
                    onDismiss={this.closeProfileFilterPane}
                    headerText="Panel - Small, right-aligned, fixed, with footer"
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this.renderProfileFilterFooterContent}>
            
                    <Checkbox
                        label="Uncontrolled checkbox with defaultChecked true"
                        defaultChecked={true}
                        // onChange={this._onCheckboxChange}
                        //styles={checkboxStyles}
                        />
                </Panel>
            </React.Fragment>
        );
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

        const index = items.findIndex((cmd: ICommandBarItemProps) => {
            return (cmd.key === "sizeLabel");
        });

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
    private renderSizing(): Array<ICommandBarItemProps> {
        let { height, width } = this.state;

        return [{
                key: 'contractVert',
                name: 'Contract vertically',
                iconProps: {
                    iconName: 'PaddingBottom'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('contractVert')
            }, {
                key: 'contractHorz',
                name: 'Contract horizontally',
                iconProps: {
                    iconName: 'PaddingRight'
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
                name: `${height}px X ${width}px`, // '1445px X 2535px'
            }, {
                key: 'expandHorz',
                name: 'Expand horizontally',
                iconProps: {
                    iconName: 'PaddingLeft'
                },
                iconOnly: true,
                onClick: () => this.handlerSizingCommandClick('expandHorz')
            }, {
                key: 'expandVert',
                name: 'Expand vertically',
                iconProps: {
                    iconName: 'PaddingTop'
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
            name: 'Add current view as favorite',
            iconProps: {
                iconName: 'AddFavorite'
            },
            onClick: () => this.handleCommandClick('savecustom')
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
        return [{
            key: 'sendFeedback',
            name: 'Send feedback',
            iconProps: {
                iconName: 'Feedback'
            },
            onClick: () => this.handleCommandClick('sendFeedback')
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
