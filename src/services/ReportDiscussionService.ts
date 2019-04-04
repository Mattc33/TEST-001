import { IReportDiscussionService } from ".";
import { 
    IReportDiscussion,
    IReportDiscussionReply 
} from "../models";

export class ReportDiscussionService implements IReportDiscussionService {

    public loadDiscussion(reportId: number): Promise<IReportDiscussion> {
        return Promise.resolve(undefined);
    }

    public loadDiscussionReplies(discussion: IReportDiscussion): Promise<Array<IReportDiscussionReply>> {
        return Promise.resolve([]);
    }
}
