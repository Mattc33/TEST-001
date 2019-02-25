import * as React from "react";
import { ReportViewerStore } from "./store/ReportViewerStore";
import { ReportViewerWithState } from "./components/viewer/ReportViewer";

export interface IReportViewerProviderProps {
  description: string;
}

export const ReportViewerProviderSFC: React.SFC<IReportViewerProviderProps> = props => {
  return (
    <ReportViewerStore>
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
