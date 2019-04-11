import { IReportDiscussionService } from ".";
import { sp, ItemAddResult, Item, Web, Items, ContentType } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { CurrentUser } from '@pnp/sp/src/siteusers';

import { 
    IReportDiscussion,
    IReportDiscussionReply 
} from "../models";
import { SPUser } from "@microsoft/sp-page-context";

const VISUALIZATION_DISCUSSION_LIST_TITLE: string = "Visualization Discussion";
export class ReportDiscussionService implements IReportDiscussionService {

    public async loadDiscussion(webUrl: string,serverRelativeUrl:string, reportId: number, reportTitle:string): Promise<IReportDiscussion> {
    let web: Web = await new Web(webUrl);
    let visualizationDiscussionCT = await this.getContentTypeByName(web,"Visualization Discussion");
    let discussion:IReportDiscussion={title:reportTitle,replies:[]};
    let visualizationItem: any[] = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).items
      .select("ID,SVPVisualizationLookup/Id,SVPVisualizationLookup/Title")
      .expand('SVPVisualizationLookup')
      .filter(`SVPVisualizationLookup/Id eq ${reportId}`)
      .get();
      if (visualizationItem && (visualizationItem.length > 0)) {
        let folderName=visualizationItem[0]['ID']+'_.000';
        let folderFileDirRef= serverRelativeUrl+'/Lists/VisualizationDiscussion/'+folderName;
        let discussionReplies: IReportDiscussionReply[]= await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE)
        .items
        .select('*,Author/Title,Author/Id,FileLeafRef, FileRef,FileDirRef')
        .expand('Author')
        .filter(`FileDirRef eq '${folderFileDirRef}'`)
        .get();
        discussion={reportFolderId:visualizationItem[0]['ID'],title:reportTitle,replies:this.mapDiscussionReplyFields(discussionReplies)};
        
      }
      else
      {
        console.info("Creating visualization discussion item content type");
        let result= await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).items.add({
            SVPVisualizationLookupId: reportId,
            Title:reportTitle,
            ContentTypeId:visualizationDiscussionCT.Id.StringValue,
        });
        discussion={reportFolderId:result.data.ID,title:reportTitle,replies:[]};
      }
      return discussion;
    }

    private async getContentTypeByName(web: Web, contentTypeName) {
        let contentType = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).contentTypes.get();
        let visualizationDiscussionCT = contentType.find(x => x.Name == contentTypeName);
        return visualizationDiscussionCT;
    }

    private mapDiscussionReplyFields(discussionReplies):IReportDiscussionReply[]
    {
      let replies:IReportDiscussionReply[]=[];
      discussionReplies.forEach(discussionReply => {
        let reply:IReportDiscussionReply={} as IReportDiscussionReply;
        reply.title=discussionReply.Title;
        reply.replyBody=discussionReply.SVPReplyBody;
        reply.parentReplyId=discussionReply.SVPParentReplyId;
        reply.createdBy= discussionReply.Author.Title;
        reply.createdById= discussionReply.AuthorId;
        reply.createdDate= discussionReply.Created;
        replies.push(reply);
      });
      return replies;
    }

    public async postReply(webUrl: string,serverRelativeUrl:string,reportId:number, reply: IReportDiscussionReply): Promise<IReportDiscussionReply> {
      let web: Web = await new Web(webUrl);
      let visualizationDiscussionReplyCT = await this.getContentTypeByName(web,"Visualization Discussion Reply");
      let folderName=reportId+'_.000';
      let listUri= serverRelativeUrl+'/Lists/VisualizationDiscussion/';
      let folderFileDirRef= serverRelativeUrl+'/Lists/VisualizationDiscussion/'+folderName;
      const p1 = new Promise<IReportDiscussionReply>((resolve, reject) => {
        web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE)
        .items.add({
          ContentTypeId:visualizationDiscussionReplyCT.Id.StringValue,
          Title: reply.title,
          SVPReplyBody:reply.replyBody,
        })
        .then((item: any) => {
          web.siteUsers.getById(item.data.AuthorId).get().then((result)=>
          {
            reply.createdDate=item.data.Created;
            reply.createdBy=result.Title;
            reply.createdById=item.data.AuthorId;
            web
            .getFileByServerRelativeUrl(`${listUri}/${item.data.Id}_.000`)
            .moveTo(`${folderFileDirRef}/${item.data.Id}_.000`).then(()=>
            {
              resolve(reply);
            }
            );
          }
          );
        }).catch((error) => {
          reject(error);
      });
      });
      return p1;
    }
}
