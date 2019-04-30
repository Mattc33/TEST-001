import { INewsItem } from "../../models/INewsItem";

export interface INewsService {
    getAllFeaturedNews(): Promise<Array<INewsItem>>;
}