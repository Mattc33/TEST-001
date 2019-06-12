export interface IReportDiscussion {
    title: string;
    replies?: Array<IReportDiscussionReply>;
    reportFolderId?: number;
}

export interface IReportDiscussionReply {
    title: string;
    replyId?:number;
    replyBody?:string;
    createdBy?:string;
    createdById?:number;
    createdDate?:Date;
    parentReplyId?: number;
    likes?:number[];
}

export interface ISentimentReply {
    Id:number;
    replyBody?:string;
}