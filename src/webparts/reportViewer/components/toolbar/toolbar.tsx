import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

export interface IToolbarProps {
  types: Array<string>;
  onClick(type: string, args: any): void;
}

export interface IToolbarState {
    items: Array<ICommandBarItemProps>;
    height: number;
    width: number;
}

class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    constructor(props) {
        super(props);

        this.state = { 
            items:  [],
            height: 1330,
            width: 2535 
        };
    }

    public render() { 
        const items = this.props.types.reduce<Array<ICommandBarItemProps>>((prev: Array<ICommandBarItemProps>, type: string): Array<ICommandBarItemProps> => {
            switch(type.toLowerCase()) {
                case "sizing":
                    return prev.concat(this.renderSizing());
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

    private handlerToolbarClick(args: string) {
        let { height, width, items } = this.state;
        switch(args) {
            case "contractVert":
                height -= 5;
                break;

            case "contractHorz":
                width -= 5;
                break;

            case "reset":
                height = 1330;
                width = 2535;
                break;

            case "expandHorz":
                width += 5;
                break;

            case "expandVert":
                height += 5;
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

    private renderSizing(): Array<ICommandBarItemProps> {
        let { height, width } = this.state;

        return [{
                key: 'contractVert',
                name: 'Contract vertically',
                iconProps: {
                    iconName: 'PaddingBottom'
                },
                iconOnly: true,
                onClick: () => this.handlerToolbarClick('contractVert')
            }, {
                key: 'contractHorz',
                name: 'Contract horizontally',
                iconProps: {
                    iconName: 'PaddingRight'
                },
                iconOnly: true,
                onClick: () => this.handlerToolbarClick('contractHorz')
            }, {
                key: 'reset',
                name: 'Reset sizes',
                iconProps: {
                    iconName: 'Refresh'
                },
                iconOnly: true,
                onClick: () => this.handlerToolbarClick('reset')
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
                onClick: () => this.handlerToolbarClick('expandHorz')
            }, {
                key: 'expandVert',
                name: 'Expand vertically',
                iconProps: {
                    iconName: 'PaddingTop'
                },
                iconOnly: true,
                onClick: () => this.handlerToolbarClick('expandVert')
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
            onClick: () => this.handlerToolbarClick('addToNewStory')
        }, {
            key: 'addToExistingStory',
            name: 'Add to existing story',
            iconProps: {
                iconName: 'TripleColumnEdit'
            },
            onClick: () => this.handlerToolbarClick('addToNewStory')
        }];
    }

    private renderFavorite(): Array<ICommandBarItemProps> {
        return [{
            key: 'addFavorite',
            name: 'Add favorite',
            iconProps: {
                iconName: 'AddFavorite'
            },
            onClick: () => this.handlerToolbarClick('addFavorite')
        }];
    }

    private renderFeedback(): Array<ICommandBarItemProps> {
        return [{
            key: 'sendFeedback',
            name: 'Send feedback',
            iconProps: {
                iconName: 'Feedback'
            },
            onClick: () => this.handlerToolbarClick('sendFeedback')
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
            onClick: () => this.handlerToolbarClick('sendFeedback')
        }];
    }
}
 
export { Toolbar };
