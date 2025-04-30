import { ContentDataModel } from "./content-data.model";

export interface SearchResults {
  Response: string,
  Search: ContentDataModel[],
  totalResults: string,
  SearchTitle: string,
  CurrentPage: number
}