import * as React from "react";
import { override } from "@microsoft/decorators";
import {IReportDiscussionReply, ISentimentReply} from "../../models/IReportDiscussion";
import {ISentimentService} from '../interfaces/ISentimentService';
import { SPHttpClient, HttpClient, SPHttpClientResponse, IHttpClientOptions, HttpClientResponse } from "@microsoft/sp-http";
import { IWebPartContext } from '@microsoft/sp-webpart-base';


export class SentimentService implements ISentimentService {

    //private _cognitiveServicesTextUrl: string = `https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/`;
    private _spHttpClient: SPHttpClient;
    private _httpClient: HttpClient;
    private _sentimentServiceAPIUrl: string;
    private _sentimentServiceAPIKey: string;

    constructor(private context: IWebPartContext) {
        this._httpClient = this.context.httpClient;
    }

    public async GetSentimentScore(sentimentReplies:ISentimentReply[], sentimentServiceAPIKey: string,sentimentServiceAPIUrl: string) : Promise<number> {

        this._sentimentServiceAPIUrl = sentimentServiceAPIUrl;
        this._sentimentServiceAPIKey = sentimentServiceAPIKey;
        const score: number = await this._getSentimentFromPageComments(sentimentReplies);
        const averageScore: number = score / sentimentReplies.length;
        return averageScore;

    }

    private async _getSentimentFromPageComments(comments: ISentimentReply[]): Promise<number> {
        const httpOptions: IHttpClientOptions = this._prepareHttpOptionsForTextApi(comments);
        const cognitiveResponse: HttpClientResponse =
            await this._httpClient.post(`${this._sentimentServiceAPIUrl}/sentiment`, HttpClient.configurations.v1, httpOptions);
        const cognitiveResponseJSON: any = await cognitiveResponse.json();


        if (cognitiveResponseJSON.documents.length === 1) {
            return cognitiveResponseJSON.documents[0].score;
        }
        //let total = 0;

        let scoreSum = 0;
        for (let i=0,l=cognitiveResponseJSON.documents.length; i<l; i++) {
            scoreSum+=cognitiveResponseJSON.documents[i].score;
        }

        return scoreSum;
    }

    private _prepareHttpOptionsForTextApi(comments: ISentimentReply[]): IHttpClientOptions {
        const body: any = {
            language: "en",
            documents: [
            ]
        };

        body.documents = comments.map((comment: ISentimentReply) => {
            return {
                id: comment.Id,
                text: comment.replyBody
            };
        });

        const httpOptions: IHttpClientOptions = {
            body: JSON.stringify(body),
            headers: this._prepareHeadersForTextApi()
        };

        return httpOptions;
    }

    private _prepareHeadersForTextApi(): Headers {
        const requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-type", "application/json");
        requestHeaders.append("Cache-Control", "no-cache");
        requestHeaders.append("Ocp-Apim-Subscription-Key", this._sentimentServiceAPIKey);

        return requestHeaders;
    }


}
