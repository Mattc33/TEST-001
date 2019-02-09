import * as React from 'react';
import { IReportViewerProps } from './IReportViewerProps';
import { Connect, ConnectBranch } from '../../store/Connect';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { ICountry } from '../../state/IReportEditorState';

class ReportViewer extends React.Component<IReportViewerProps, {}> {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }

  public shouldComponentUpdate(nextProps: IReportViewerProps, nextState: any): boolean {
    //   console.info('ReportViewer', nextProps.state, this.props.state);
    // if (isEqual(nextProps.state, this.props.state)) {
    //   return false;
    // }

    return true;
  }

  public componentDidMount() {
    const viewerProps = this.props.state; 
    viewerProps.actions.loadReportData();
  }

  public render(): React.ReactElement<IReportViewerProps> {
    console.info('ReportViewer', this.props);
    const viewerProps = this.props.state; //.reportEditor;

    let items = [<div>Viewer Webpart => { this.props.description }</div>];
    if (!viewerProps.loading && viewerProps.countries && viewerProps.countries.length > 0) {
        items = viewerProps.countries.map((c: ICountry) => {
            return (
                <div key={c.id}>
                    <div>{c.id} - {c.title}</div>
                    { !c.isSaving && 
                        <div><button id={`button_${c.id}`} onClick={(e) => viewerProps.actions.saveCountry(c)}>Save</button></div>
                    }
                    { c.isSaving && 
                        <div>Saving...</div>
                    }
                </div>
            );
        });
    }

    const control = (viewerProps.loading) 
      ? <div>Loading...</div>
      : (<div className="container">
            { items }  
        </div>);
  
    return (
      <div>
        { control }
      </div>
    );
  }

  private handleSave(e: React.SyntheticEvent<HTMLButtonElement>, country: ICountry) {
      e.preventDefault();
      e.stopPropagation();

      console.info(country);

    //this.props.state.actions.saveCountry(country);
  }
}

const ReportViewerWithState = ConnectBranch(ReportViewer, "reportViewer");
export { ReportViewerWithState };