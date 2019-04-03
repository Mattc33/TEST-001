import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';
  import {
    IReportDiscussionState,
    REPORT_DISCUSSION_PATH,
  } from "../.";

  import { autobind } from 'office-ui-fabric-react';
  import { IReportDiscussionService, ReportDiscussionService } from "../../../../services";
  import { normalize } from "normalizr";
  import { BaseAction, IBaseStore } from "../../../../base";
    import { IErrorResult, IReportItem, IUserProfile, IUserItem } from "../../../../models";
  
  export class ReportDiscussionActions extends BaseAction<IReportDiscussionState,IBaseStore> {
    private context: WebPartContext;
    private reportDiscussionApi: IReportDiscussionService;
  
    constructor(store: IBaseStore, context: WebPartContext) {
      super(store);
  
      this.context = context;
      this.reportDiscussionApi = new ReportDiscussionService();
    }
  
  
    @autobind
    private dispatchError(msg: string, err: any, status: any) {
      const error: IErrorResult = {
        errorMessage: msg,
        error: err
      };
  
      this.dispatch({ ...status, error });
    }
  
    @autobind
    private async dispatch(incoming: any) {
      await this.dispatcher({
        [REPORT_DISCUSSION_PATH]: {
          ...this.getState()[REPORT_DISCUSSION_PATH],
          ...incoming
        }
      });
    }
  }
  