import * as React from "react";
import { ReportViewerStore } from "./store/ReportViewerStore";
import { ReportViewerWithState } from "./components/viewer/ReportViewer";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

export interface IReportViewerProviderProps {
  description: string;
  context: WebPartContext;
}

export const ReportViewerProviderSFC: React.SFC<IReportViewerProviderProps> = props => {
  console.info('ReportViewerProviderSFC', props);
  return (
    <ReportViewerStore context={props.context}>
      <ReportViewerWithState {...props} />
    </ReportViewerStore>
  );
};

// export class ReportViewerProvider extends React.Component<
//   IReportViewerProviderProps,
//   {}
// > {
//   constructor(props: IReportViewerProviderProps) {
//     super(props);
//   }

//   public render() {
//     return (
//       <ReportViewerStore>
//         <ReportViewerWithState description={this.props.description} />
//       </ReportViewerStore>
//     );
//   }
// }
