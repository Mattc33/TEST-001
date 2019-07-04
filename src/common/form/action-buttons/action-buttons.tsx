import * as React from 'react';
import * as _ from 'lodash';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export interface IActionButtonslProps {

    submitting: boolean;
    showDelete: boolean;

    deleteConfirmText: string;
    deleteCancelText: string;

    saveText: string;
    deleteText: string;
    cancelText: string;

    onSave: (e) => void;
    onDelete: (e) => void;
    onCancel: (e) => void;

}

export interface IActionButtonslState {
    showDeleteConfirmation: boolean;
}

export class ActionButtons extends React.Component<IActionButtonslProps, IActionButtonslState> {

    constructor(props: IActionButtonslProps) {

        super(props);

        this.state = { 
            showDeleteConfirmation: false
        };

    }

    public render() {

        const { showDeleteConfirmation } = this.state;

        return (
            <div>

                { !!showDeleteConfirmation &&
                    <div className="general__btn-group--right">
                        <button 
                            type="button" 
                            className="general__button general__button--small general__button--grey"
                            disabled={this.props.submitting} 
                            onClick={this.cancelDelete}>{this.props.deleteCancelText}</button>
                        <button 
                            type="button" 
                            className="general__button general__button--small general__button--alert"
                            disabled={this.props.submitting}
                            onClick={this.props.onDelete}>{this.props.deleteConfirmText}</button>
                    </div>
                }

            { !showDeleteConfirmation &&
                <div className="general__btn-group--right">

                    { !!this.props.showDelete &&
                        <button 
                            type="button" 
                            className="general__button general__button--small general__button--alert general--pull-left" 
                            onClick={this.showDeleteConfirmation}
                        >{this.props.deleteText}</button>
                    }

                    <button 
                        type="button"
                        className="general__button general__button--small general__button--clear" 
                        onClick={this.props.onCancel}>{this.props.cancelText}</button>
                    <button
                        type="submit"
                        className="general__button general__button--small general__button--brand-primary"
                        disabled={this.props.submitting}
                        onClick={this.props.onSave}
                    >{this.props.saveText}</button>
                </div>
            }
            </div>

        );

    }

    @autobind
    private showDeleteConfirmation() {

        this.setState({
            showDeleteConfirmation: true
        });

    }

    @autobind
    private cancelDelete() {

        this.setState({
            showDeleteConfirmation: false
        });

    }

}
