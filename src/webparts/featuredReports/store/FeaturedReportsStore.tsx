import * as React from "react";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

import { BaseStore } from "../../../base";
import { IContextProps } from "../../../models";
import { IFeaturedReportsState } from "../state/IFeaturedReportsState";
import { IFeaturedReportsProviderProps } from "../state/IFeaturedReportsProviderProps";

import { FeaturedReportsActions } from "../action/FeaturedReportsActions";

export const FeaturedReportsContext = React.createContext<IContextProps<IFeaturedReportsState>>(undefined);

export interface IFeaturedReportsStoreProps {
    storeState: IFeaturedReportsProviderProps;
}

export class FeaturedReportsStore extends BaseStore<IFeaturedReportsStoreProps, IFeaturedReportsState> {
  constructor(props: IFeaturedReportsStoreProps) {
    super(props);

    const actions = new FeaturedReportsActions(this, props.storeState.context);

    this.state = {
        clientLabel: props.storeState.SVPClientLabel,
        webpartTitle: props.storeState.SVPTitle,
        context: props.storeState.context,
        actions: actions
    };
  }

//   public static getDerivedStateFromProps(props: IReportViewerStoreProps, state: IReportViewerState) {
//     if (props.storeState.tableauReportConfig !== state.reportViewer.tableauReportConfig) {
//       state.reportViewer.tableauReportConfig = props.storeState.tableauReportConfig;
//       return state;
//     }

//     return null;
//   }

  public render() {
    const state = this.state;

    return (
      <FeaturedReportsContext.Provider value={{ state }}>
        {this.props.children}
      </FeaturedReportsContext.Provider>
    );
  }
}
