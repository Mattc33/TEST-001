import * as React from "react";
import { ReportViewerStore } from "./store/ReportViewerStore";
import { ReportViewerWithState } from "./components/ReportViewer";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

import {
  IReportViewerProviderProps
} from "./state/IReportViewerProviderProps";

export const ReportViewerProviderSFC: React.FunctionComponent<IReportViewerProviderProps> = props => {
  return (
    <ReportViewerStore storeState={props}>
      <ReportViewerWithState />
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
