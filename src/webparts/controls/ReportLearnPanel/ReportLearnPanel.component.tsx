import * as React from 'react';
import styles from './ReportLearnPanel.module.scss';

// Third Party
import { Panel, PanelType, Layer } from 'office-ui-fabric-react';

// Interface
import { IReportLearnPanelProps, IReportLearnPanelState } from './ReportLearnPanel.interface';

export class ReportLearnPanel extends React.Component<IReportLearnPanelProps, IReportLearnPanelState> {

   public state = {
      showLearnPanel: true
   }

   public componentDidMount = () => {
      console.log(this.props.report)
   }

   private convertStringToJsx = (richTextReport: string): JSX.Element[] => { // returns an arr of jsx.elements
      return 
   }

   public render = (): JSX.Element => {
      return (
         <Panel 
            dir={'rtl'} // direction right to left
            isOpen={this.state.showLearnPanel}
            type={PanelType.custom}
            customWidth="600px"
            onDismiss={this.props.onCancel}
            closeButtonAriaLabel="Close"
         >
            <main className={styles['Learn-Panel-Container']} dir={'ltr'}>
               <header className={styles['Learn-Panel-Header']}>
                  ViewPort Learning Panel: 
                  <span className={styles['Learn-Panel-Header-Title']}> {this.props.report.Title}</span>
               </header>
               <section className={styles['Learn-Panel-Content']}>
                  {this.props.reportRichText}
               </section>
            </main>
         </Panel>
      );
   }
}

/*

<div style={{ fontSize: '18px', fontWeight: 500 }}>: {this.props.discussion.title}</div>

*/