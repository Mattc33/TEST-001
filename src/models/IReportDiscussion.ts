export interface IReportDiscussion {
    title: string;
    replies?: Array<IReportDiscussionReply>;
}

export interface IReportDiscussionReply {
    title: string;
}
