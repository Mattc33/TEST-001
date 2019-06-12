
import {IReportDiscussionReply, ISentimentReply} from "../../models/IReportDiscussion";

export interface ISentimentService {
    GetSentimentScore(sentimentReplies:ISentimentReply[], sentimentServiceAPIKey: string, sentimentServiceAPIUrl: string) : Promise<number>;

}