import { 
    IReportDiscussion,
    IReportDiscussionReply 
} from "../../models";

export interface IReportDiscussionService {
    loadDiscussion(webUrl: string,serverRelativeUrl:string, reportId: number, reportTitle:string): Promise<IReportDiscussion>;
    postReply(webUrl: string,serverRelativeUrl:string,reportId:number,discussion: IReportDiscussionReply): Promise<IReportDiscussionReply>;
}
