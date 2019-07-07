import * as React from 'react';
import * as _ from 'lodash';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { PeoplePicker } from '../../people-picker-ctrl';
import { FormFieldType } from '../form-field-type';
import { IMeetingBook } from '../../../models';
import { ErrorMessage } from '../../error-message';
import { IUserService } from '../../../services';
import { ActionButtons } from '../action-buttons/action-buttons';

export interface IMeetingBookFormCtrlProps {

    [otherProps: string]: any;
    loading: boolean;

    error?: Array<string> | string;

    initialValues: IMeetingBook;

    submitting: boolean;

    onModalClose: () => void;
    onSave: (meetingBook: IMeetingBook) => void;

    userService: IUserService;

}

export interface IMeetingBookFormCtrlState {

    form: {[fieldName: string]: FormFieldType };

}

export class MeetingBookForm extends React.Component<IMeetingBookFormCtrlProps, IMeetingBookFormCtrlState> {

    constructor(props: IMeetingBookFormCtrlProps) {

        super(props);

        const meetingBook = props.initialValues ? props.initialValues : null;

        this.state = { 
            form: this.initForm(meetingBook)
        };

    }

    public componentWillReceiveProps(newProps: IMeetingBookFormCtrlProps) {

        const meetingBook = newProps.initialValues ? newProps.initialValues : null;

        if(!_.isEqual(this.props.initialValues, newProps.initialValues))
            this.setState({
                form: this.initForm(meetingBook)
            });

    }

    public render() {

        const { loading, error } = this.props;
        const { form } = this.state;
        
        return (

            <form onSubmit={this.handleSubmit(this.props.onSave)}>
                <div className="modal-header">

                    <button type="button" className="close" onClick={this.props.onModalClose} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3 className="modal-title">
                        {!form.Id.value  && 'Add Meeting Book'}
                        {!!form.Id.value && 'Update Meeting Book'}
                    </h3>
    
                </div>

                { !!loading &&

                    <div className="modal-body">
                        <Spinner size={SpinnerSize.medium} label="Loading meeting book details..." />
                    </div>

                }

                <ErrorMessage error={error} show={!loading} />

                { !loading &&
                    <div className="modal-body">

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="Status">Status</label>
                                    <select className="custom-select custom-select--medium-weight" name="Status" id="Status" value={form.Status.value} onChange={this.onFieldChange}>
                                        <option value="In Progress" selected={form.Status.value === 'In Progress'}>In Progress</option>
                                        <option value="Published" selected={form.Status.value === 'Published' }>Published</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">

                                    <label
                                        htmlFor="Title">Name</label>

                                    <input
                                        id="Title"
                                        name="Title"
                                        value={form.Title.value}
                                        onChange={this.onFieldChange}
                                        onBlur={this.onFieldBlur}
                                        onFocus={this.onFieldFocus}
                                        className="general__input"
                                        placeholder="Meeting book name" />
            
                                    {form.Title.touched &&
                                        (form.Title.errorMessage && <span className="input-error">{form.Title.errorMessage}</span>)}

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">

                                    <label htmlFor="share-with-all">Share With</label>

                                    <div className="custom-control custom-checkbox modal__custom-checkbox modal__checkbox--spacing">
                                        
                                        <input
                                            id="ShareWithAll"
                                            name="ShareWithAll"
                                            className="custom-control-input"
                                            type="checkbox"
                                            checked={this.state.form.ShareWithAll.value}
                                            onChange={this.handleCheckboxChange}
                                            value="ShareWithAll" />
                                        <label
                                            htmlFor="ShareWithAll"
                                            className="custom-control-label">Share With All</label>

                                    </div>

                                    { !this.state.form.ShareWithAll.value && 

                                        <PeoplePicker
                                            placeHolderText="Shared with..."
                                            multi={true}
                                            onChange={this.normalizedOnChange('SharedWith')}
                                            userService={this.props.userService}
                                            principals={this.state.form.SharedWith.value} />

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                }
                
                <div className="modal-footer">

                    <ActionButtons
                        showDelete={false}
                        submitting={this.props.submitting}
                        deleteCancelText=""
                        deleteConfirmText=""
                        deleteText=""
                        cancelText="Close"
                        saveText="Save"
                        onCancel={this.props.onModalClose}
                        onSave={this.handleSubmit(this.props.onSave)}
                        onDelete={() => {}} />

                </div>
            </form>
        );

    }

    @autobind
    private initForm(initialValues: IMeetingBook) {

        const initialState = {
            Id: {
                value: (initialValues && initialValues.Id) ? initialValues.Id : null,
                touched: false,
                errorMessage: null,
                ignore: true
            },
            Title: {
                value: initialValues && initialValues.Title ? initialValues.Title : '',
                touched: false,
                errorMessage: null
            },
            Status: {
                value: initialValues && initialValues.Status ? initialValues.Status : 'In Progress',
                touched: false,
                errorMessage: null
            },
            SharedWith: {
                value: initialValues && initialValues.SharedWith ? initialValues.SharedWith : [],
                touched: false,
                errorMessage: null
            },
            ShareWithAll: {
                value: initialValues && initialValues.ShareWithAll ? initialValues.ShareWithAll : false,
                touched: false,
                errorMessage: null
            }
        };

        return initialState;

    }

    @autobind
    private handleSubmit(onValid: (values: IMeetingBook) => void) {

        return (e) => {

            e.preventDefault();
            e.stopPropagation();

            this.handleValidation(true, this.validateForm, onValid);

        };

    }

    @autobind
    private handleValidation(formSubmit: boolean, validator: (state: IMeetingBookFormCtrlState) => {[fieldName: string]: string}, onSuccess?: (values: any) => void) {

        const errors = validator(this.state);
        const form = {...this.state.form};

        Object.keys(this.state.form).forEach( (key, idx) => {

            if(!!form[key].ignore) 
                return;

            const error = errors[key] || null;
            form[key].errorMessage = error;

            if(formSubmit)
                form[key].touched = true;

        });

        this.setState({
            form
        }, () => {
            if(_.isEmpty(errors) && !!onSuccess)
                onSuccess(this.getOnSaveObject(this.state));
        });

    }

    @autobind
    private validateForm(state: IMeetingBookFormCtrlState): {[fieldName: string]: string} {

        const errors: {[fieldName: string]: string} = {};

        if(!state.form.Title.value) {
            errors.Title = 'A title is required.';
        }

        return errors; 

    }

    @autobind
    private handleFieldChange(name, value) {

        const nextFieldState = {
            ...this.state.form[name],
            value,
            touched: true
        };
        const nextState = {
            ...this.state.form,
            [name]: nextFieldState
        };
        this.setState({
            form: nextState
        }, () => {
            this.handleValidation(false, this.validateForm, null);
        });

    }

    @autobind
    private handleCheckboxChange(e) {

        const {name, checked} = e.target;

        this.handleFieldChange(name, checked);

    }

    @autobind
    private onFieldChange(e) {

        const {name, value} = e.target;

        this.handleFieldChange(name, value);
        
    }

    @autobind
    private onFieldBlur(e) {

        const {name} = e.target;
        const nextFieldState = {
            ...this.state.form[name],
            touched: true
        };
        const nextState = {
            ...this.state.form,
            [name]: nextFieldState
        };

        this.setState({
            form: nextState
        }, () => {
            this.handleValidation(false, this.validateForm, null);
        });

    }

    @autobind 
    private onFieldFocus(e) {

    }

    @autobind
    private normalizedOnChange(name) {
        return (value) => {
            this.handleFieldChange(name, value);
        };
    }

    @autobind
    private getOnSaveObject(state: IMeetingBookFormCtrlState) {

        const initialValues = this.props.initialValues ? this.props.initialValues : {};

        const meetingBook: IMeetingBook = {
            ...initialValues,
            Id: state.form.Id.value || null,
            Title: state.form.Title.value,
            Status: state.form.Status.value,
            SharedWith: state.form.SharedWith.value,
            ShareWithAll: state.form.ShareWithAll.value
        };

        return meetingBook;

    }

}
