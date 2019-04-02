import {
    WebPartContext
} from '@microsoft/sp-webpart-base';

import {
    IReportDiscussion,
    IReportDiscussionReply
} from "../../../../models";

export const REPORT_DISCUSSION_PATH: string = "reportDiscussion";

export interface IReportDiscussionState {
    context: WebPartContext;
    loading?: boolean;

    report: IReportDiscussion;
    replies: Array<IReportDiscussionReply>;
}