import { ContentDataModel } from "./content-data.model";

export interface List {
  listID: string,
  Name: string,
  Description: string,
  Image: string,
  Content: ContentDataModel[]
}