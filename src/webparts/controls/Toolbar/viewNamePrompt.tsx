import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export interface IViewNamePromptProps {
    defaultViewName: string;

    onOk(viewName: string): void;
    onCancel(state: boolean): void;
}
 
export interface IViewNamePromptState {
    viewName: string;
}
 
class ViewNamePrompt extends React.Component<IViewNamePromptProps, IViewNamePromptState> {
    constructor(props: IViewNamePromptProps) {
        super(props);
        this.state = {
            viewName: props.defaultViewName
        };
    }

    public render() { 
        return ( 
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg2">
                    <span>View Name : </span>
                    </div>
                    <div className="ms-Grid-col ms-lg8">
                    <input 
                        type="text" 
                        value={`Copy of ${this.state.viewName}`}
                        onChange={(e) => this.handleViewNameInputChange(e)}
                        style={{ width: '100%'}} />
                    </div>
                    <div className="ms-Grid-col ms-lg2" style={{ float: "right"}}>
                    <IconButton iconProps={{ iconName: 'Accept'}} title='Ok' onClick={() => this.props.onOk(this.state.viewName)} />
                    <IconButton iconProps={{ iconName: 'Cancel'}} title='Cancel' onClick={() => this.props.onCancel(false)} />
                    </div>
                </div>
            </div>
        );
    }

    private handleViewNameInputChange(e: React.SyntheticEvent<HTMLInputElement>) {
        this.setState({
            viewName: e.currentTarget.value
        });
    }
}
 
export { ViewNamePrompt };