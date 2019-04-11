export interface IReportDiscussion {
    title: string;
    replies?: Array<IReportDiscussionReply>;
    reportFolderId?: number;
}

export interface IReportDiscussionReply {
    title: string;
    replyBody?:string;
    createdBy?:string;
    createdById?:number;
    createdDate?:Date;
    parentReplyId?: number;
}
