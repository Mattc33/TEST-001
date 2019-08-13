import * as React from 'react';
import styles from './ReportLearnPanel.module.scss';

// Third Party
import { Panel, PanelType } from 'office-ui-fabric-react';

// Interface
import { IReportLearnPanelProps, IReportLearnPanelState } from './ReportLearnPanel.interface';

export class ReportLearnPanel extends React.Component<IReportLearnPanelProps, IReportLearnPanelState> {

   public state = {
      showLearnPanel: true
   }

   public componentDidMount = () => {
      console.log('ReportLearnPanel Fired');
      console.log(typeof this.props.richTextReport)
   }

   // private 

   public render = (): JSX.Element => {
      return (
         <Panel 
            dir={'rtl'} // direction right to left
            isOpen={true}
            type={PanelType.custom}
            customWidth="600px"
            onDismiss={this.props.onCancel}
            closeButtonAriaLabel="Close">
         >
            <main className={styles['Learn-Panel-Container']}>
               {this.props.richTextReport}
            </main>
         </Panel>
      )
   }

}