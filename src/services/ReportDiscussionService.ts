import { IReportDiscussionService } from ".";
import { sp, ItemAddResult, Item, Web, Items, ContentType } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { CurrentUser } from '@pnp/sp/src/siteusers';

import {
  IReportDiscussion,
  IReportDiscussionReply
} from "../models";
import { SPUser } from "@microsoft/sp-page-context";
import { number } from "prop-types";

const VISUALIZATION_DISCUSSION_LIST_TITLE: string = "Visualization Discussion";
const VISUALIZATION_DISCUSSION_LIST_URL:string="/Lists/VisualizationDiscussion/";
export class ReportDiscussionService implements IReportDiscussionService {

  public async loadDiscussion(webUrl: string, serverRelativeUrl: string, reportId: number, reportTitle: string): Promise<IReportDiscussion> {
    let web: Web = await new Web(webUrl);
    let visualizationDiscussionCT = await this.getContentTypeByName(web, "Visualization Discussion");
    let discussion: IReportDiscussion = { title: reportTitle, replies: [] };
    let visualizationItem: any[] = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).items
      .select("ID,SVPVisualizationLookup/Id,SVPVisualizationLookup/Title")
      .expand('SVPVisualizationLookup')
      .filter(`SVPVisualizationLookup/Id eq ${reportId}`)
      .get();
    if (visualizationItem && (visualizationItem.length > 0)) {
      let folderName = visualizationItem[0]['ID'] + '_.000';
      let folderFileDirRef = serverRelativeUrl + VISUALIZATION_DISCUSSION_LIST_URL + folderName;
      let discussionReplies: IReportDiscussionReply[] = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE)
        .items
        .select('*,Author/Title,Author/Id,FileLeafRef, FileRef,FileDirRef')
        .expand('Author')
        .filter(`FileDirRef eq '${folderFileDirRef}'`)
        .get();
      discussion = { reportFolderId: visualizationItem[0]['ID'], title: reportTitle, replies: this.mapDiscussionReplyFields(discussionReplies) };

    }
    else {
      console.info("Creating visualization discussion item content type");
      let result = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).items.add({
        SVPVisualizationLookupId: reportId,
        Title: reportTitle,
        ContentTypeId: visualizationDiscussionCT.Id.StringValue,
      });
      discussion = { reportFolderId: result.data.ID, title: reportTitle, replies: [] };
    }
    return discussion;
  }

  private async getContentTypeByName(web: Web, contentTypeName) {
    let contentType = await web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE).contentTypes.get();
    let visualizationDiscussionCT = contentType.find(x => x.Name == contentTypeName);
    return visualizationDiscussionCT;
  }

  private mapDiscussionReplyFields(discussionReplies): IReportDiscussionReply[] {
    let replies: IReportDiscussionReply[] = [];
    discussionReplies.forEach(discussionReply => {
      let reply: IReportDiscussionReply = {} as IReportDiscussionReply;
      reply.title = discussionReply.Title;
      reply.replyId = discussionReply.ID;
      reply.replyBody = discussionReply.SVPReplyBody;
      reply.parentReplyId = discussionReply.SVPParentReplyId;
      reply.createdBy = discussionReply.Author.Title;
      reply.createdById = discussionReply.AuthorId;
      reply.createdDate = discussionReply.Created;
      reply.likes=(discussionReply.SVPLikes===null || discussionReply.SVPLikes==='')?[]:JSON.parse(discussionReply.SVPLikes);
      replies.push(reply);
    });
    return replies;
  }

  public async postReply(webUrl: string, serverRelativeUrl: string, reportId: number, reply: IReportDiscussionReply): Promise<IReportDiscussionReply> {
    let web: Web = await new Web(webUrl);
    let visualizationDiscussionReplyCT = await this.getContentTypeByName(web, "Visualization Discussion Reply");
    let folderName = reportId + '_.000';
    let listUri = serverRelativeUrl + VISUALIZATION_DISCUSSION_LIST_URL;
    let folderFileDirRef = serverRelativeUrl + VISUALIZATION_DISCUSSION_LIST_URL + folderName;
    const p1 = new Promise<IReportDiscussionReply>((resolve, reject) => {
      web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE)
        .items.add({
          ContentTypeId: visualizationDiscussionReplyCT.Id.StringValue,
          Title: reply.title,
          SVPReplyBody: reply.replyBody,
          SVPParentReplyId: reply.parentReplyId,
        })
        .then((item: any) => {
          web.siteUsers.getById(item.data.AuthorId).get().then((result) => {
            reply.createdDate = item.data.Created;
            reply.createdBy = result.Title;
            reply.createdById = item.data.AuthorId;
            reply.replyId = item.data.Id;
            reply.likes=[];

            web
              .getFileByServerRelativeUrl(`${listUri}/${item.data.Id}_.000`)
              .moveTo(`${folderFileDirRef}/${item.data.Id}_.000`).then(() => {
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

  public async updateReply(webUrl: string, reply: IReportDiscussionReply): Promise<IReportDiscussionReply> {
    let web: Web = await new Web(webUrl);
    const p1 = new Promise<IReportDiscussionReply>((resolve, reject) => {
      let list = web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE);
      list.items.getById(reply.replyId).update({
        Title: reply.title,
        SVPReplyBody: reply.replyBody,
      }).then(({ item }) => {
        item.get().then((result) => {
          reply.createdDate = result.Modified;
          resolve(reply);
        });
      })
        .catch((error) => {
          reject(error);
        });
    });
    return p1;
  }

  public async deleteReply(webUrl: string, reply: IReportDiscussionReply): Promise<IReportDiscussionReply> {
    let web: Web = await new Web(webUrl);
    const promiseRoot = new Promise<IReportDiscussionReply>((resolve, reject) => {
      let list = web.lists.getByTitle("Visualization Discussion");
      let filter = `Id eq ${reply.replyId}`;
      if (reply.parentReplyId === null) {
        filter = filter + `or SVPParentReplyId eq ${reply.replyId}`;
      }
      var batch = sp.createBatch();
      list.items.filter(`${filter}`).get().then((items) => {
        items.forEach(i => {
          list.items.getById(i["ID"]).inBatch(batch).delete().then(r => {
            console.log("deleted");
          });
        });
        batch.execute().then(() => {
          console.log("All deleted");
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });

    });
    return promiseRoot;
  }

  public async getCurrentUserId(webUrl: string): Promise<number> {
    let web: Web = await new Web(webUrl);
    const p1 = new Promise<number>((resolve, reject) => {
      web.currentUser.get().then((result) => {
        resolve(result.Id);
      }
      ).catch((error) => {
        reject(error);
      });
    });
    return p1;
  }

  public async likeComment(webUrl: string,currentUserId:number,replyId):Promise<number[]>
  {
    let web: Web = await new Web(webUrl);
    let likes:number[]=[];
    const promiseRoot = new Promise<number[]>((resolve, reject) => {
      let list = web.lists.getByTitle(VISUALIZATION_DISCUSSION_LIST_TITLE);
      list.items.getById(replyId).get().then((result)=>
      {
            likes=(result.SVPLikes===null || result.SVPLikes==='')?[]:JSON.parse(result.SVPLikes);
            if(likes.indexOf(currentUserId)!==-1)
            {
              var index = likes.indexOf(currentUserId);
              likes.splice(index,1);
            }
            else
            {
              likes.push(currentUserId);
            }
            var likesString=JSON.stringify(likes);
            list.items.getById(replyId).update(
              {
                SVPLikes:likesString
              }
            ).then(()=>
            {
              resolve(likes);
            }
            ).catch((error) => {
              reject(error);
            });
      });
    });
    return promiseRoot;
  }

}