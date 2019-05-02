import { INewsItem } from "../../models/INewsItem";

export interface INewsService {
    getAllFeaturedNews(listName:string): Promise<Array<INewsItem>>;
}