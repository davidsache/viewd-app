export interface Season {
  Episodes: {
    Episode: string,
    Released: string,
    Title: string,
    imdbID: string,
    imdbRating: string
  }[],
  Response: string,
  Season: string,
  Title: string
  totalSeasons: string
}