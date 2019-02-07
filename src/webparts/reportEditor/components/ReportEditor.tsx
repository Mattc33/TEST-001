import * as React from 'react';
import styles from './ReportEditor.module.scss';
import { IReportEditorProps } from './IReportEditorProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ReportEditor extends React.Component<IReportEditorProps, {}> {
  public render(): React.ReactElement<IReportEditorProps> {
    return (
      <div className={ styles.reportEditor }>
        Demo webpart
      </div>
    );
  }
}
