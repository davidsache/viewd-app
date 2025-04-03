export interface SearchResults {
  Response: string,
  Search: {
    Title: string,
    Year: string, 
    imdbID: string, 
    Type: string, 
    Poster: string
  }[],
  totalResults: string,
  SearchTitle: string,
  CurrentPage: number
}