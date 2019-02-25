import * as React from 'react';
import styles from './ReportEditor.module.scss';
import { IReportEditorProps } from './IReportEditorProps';
import { Connect, ConnectBranch } from '../../store/Connect';
import { isEqual } from '@microsoft/sp-lodash-subset';

class ReportEditor extends React.Component<IReportEditorProps, {}> {

  public shouldComponentUpdate(nextProps: IReportEditorProps, nextState: any): boolean {
    if (isEqual(nextProps.state, this.props.state)) {
      return false;
    }

    return true;
  }

  public componentDidMount() {
    const editorProps = this.props.state; 
    editorProps.actions.loadReportData();
  }

  public render(): React.ReactElement<IReportEditorProps> {
    const editorProps = this.props.state; //.reportEditor;

    const control = (editorProps.loading) 
      ? <div>Loading...</div>
      : (<div className={ styles.reportEditor }>
          Demo webpart => { this.props.description }
        </div>);
  
    return (
      <div>
        { control }
      </div>
    );
  }
}

const ReportEditorWithState = ConnectBranch(ReportEditor, "reportEditor");
export { ReportEditorWithState };