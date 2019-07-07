import * as React from 'react';
import { Alert } from 'react-bootstrap';

export interface IErrorMessage {
    show?: boolean;
    error?: string | Array<string>;
}

export const ErrorMessage = (props: IErrorMessage) => {

    if(!props.error)
        return null;
    
    if(!props.show)
        return null;

    const errors = Array.isArray(props.error)
        ? (props.error as Array<string>).map(e => {
            return <h5>{e}</h5>;
        }) : <h5>{props.error}</h5>;

    return (
        <Alert bsStyle="danger">
            {errors}
        </Alert>
    );
};