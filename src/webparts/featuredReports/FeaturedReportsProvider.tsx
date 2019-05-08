import * as React from "react";
import { FeaturedReportsStore } from "./store/FeaturedReportsStore";
import { FeaturedReportsWithState } from "./components/FeaturedReports";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

import {
    IFeaturedReportsProviderProps
} from "./state/IFeaturedReportsProviderProps";

export const FeaturedReportsProviderSFC: React.FunctionComponent<IFeaturedReportsProviderProps> = props => {
  return (
    <FeaturedReportsStore storeState={props}>
      <FeaturedReportsWithState />
    </FeaturedReportsStore>
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
