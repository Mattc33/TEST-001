import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

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
            width: this.props.width
        };
    }

    public render() { 
        const items = this.props.types.reduce<Array<ICommandBarItemProps>>((prev: Array<ICommandBarItemProps>, type: string): Array<ICommandBarItemProps> => {
            switch(type.toLowerCase()) {
                case "sizing":
                    return prev.concat(this.renderSizing());
                case "savecustom":
                    return prev.concat(this.renderSaveCusomtView());
                case "story":
                    return prev.concat(this.renderStory());
                case "favorite":
                    return prev.concat(this.renderFavorite());
                case "feedback":
                    return prev.concat(this.renderFeedback());
                case "fullscreen":
                    return prev.concat(this.renderFullScreen());
                default:
                    return prev;
            }
        }, []);

        return (  
            <CommandBar
                items={items}
            />
        );
    }

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

    private handleCommandClick(type: string, args?: any) {
        this.props.onClick(type, args);
    }

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

    private renderSaveCusomtView(): Array<ICommandBarItemProps> {
        return [{
            key: 'savecustom',
            name: 'Save as custom view',
            iconProps: {
                iconName: 'Save'
            },
            onClick: () => this.handleCommandClick('savecustom')
        }];
    }

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
}
 
export { Toolbar };
