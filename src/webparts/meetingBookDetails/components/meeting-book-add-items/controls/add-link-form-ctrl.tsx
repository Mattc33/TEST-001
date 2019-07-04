import * as React from 'react';
import * as _ from 'lodash';
import {
    FormErrors,
    Field,
    reduxForm,
    DecoratedComponentClass
} from 'redux-form';
import { ActionButtons } from '../../../../../common/form/action-buttons/action-buttons';

export interface ILink {
    url: string;
    title: string;
}

export interface IAddLinkFormProps {

    onCancel: () => void;
    onAdd: (link: ILink) => void;

    submitting?: boolean;
    handleSubmit?: any;

}

class AddLinkForm extends React.Component<IAddLinkFormProps, {}> {

    constructor(props: IAddLinkFormProps) {

        super(props);

        this.onSubmit = this.onSubmit.bind(this);

    }

    public render(): React.ReactElement<IAddLinkFormProps> {

        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>

                <Field
                    name="Url"
                    type="text"
                    component={this.renderUrlField} />

                <Field
                    name="LinkTitle"
                    type="Text"
                    component={this.renderTitleField} />

                <ActionButtons
                    showDelete={false}
                    submitting={!!this.props.submitting}
                    deleteCancelText=""
                    deleteConfirmText=""
                    deleteText=""
                    cancelText="Cancel"
                    saveText="Add Item"
                    onCancel={this.props.onCancel}
                    onSave={this.props.handleSubmit(this.onSubmit)}
                    onDelete={() => {}} />

            </form>
        );

    }

    private renderUrlField(field) {
        return (

            <div className="form-group">

                <label htmlFor="Url">URL</label>
                <input
                    {...field.input}
                    type="text"
                    className="form-control"
                    placeholder="e.g. https://sp.atlantic.com/calendar/" />

                {field.meta.touched &&
                    (field.meta.error && <span className="input-error">{field.meta.error}</span>)}

            </div>
        );
    }

    private renderTitleField(field) {

        return (

            <div className="form-group">
                <label htmlFor="LinkTitle">Link Title</label>
                <input
                    {...field.input}
                    type="text"
                    className="form-control"
                    placeholder="e.g. Kelly's Calendar" />

                {field.meta.touched &&
                    (field.meta.error && <span className="input-error">{field.meta.error}</span>)}
            </div>

        );

    }

    private onSubmit(data) {

        const link: ILink = {
            url: data.Url,
            title: data.LinkTitle
        };

        this.props.onAdd(link);

    }

}

const validateForm = (values, props): FormErrors<any, void> => {

    const errors: FormErrors<any, any> = {};

    if(!values.Url)
        errors.Url = 'Url is required.';

    if(!values.LinkTitle)
        errors.LinkTitle = 'Title is required.';

    return errors;

};

const addLinkFormConfig = {
    form: 'AddLinkForm',
    validate: validateForm,
    enableReinitialize: true,
    pure: true
};

export const AddLinkFormCtrl =
    reduxForm(addLinkFormConfig)(
        AddLinkForm);
