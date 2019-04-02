import { 
    IReportDiscussion,
    IReportDiscussionReply 
} from "../../models";

export interface IReportDiscussionService {
    loadDiscussion(reportId: number): Promise<IReportDiscussion>;
    loadDiscussionReplies(discussion: IReportDiscussion): Promise<Array<IReportDiscussionReply>>;
}
