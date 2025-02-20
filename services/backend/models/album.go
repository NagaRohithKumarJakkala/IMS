package models
import (
    "net/http"
    "backend/initializers"
    "github.com/gin-gonic/gin"
)
// album represents data about a record album.
type Album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}

 // albums slice to seed record album data.
// var albums = []Album{
//     {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
//     {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
//     {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
// }
//
// getAlbums responds with the list of all albums as JSON.
func GetAlbums(c *gin.Context) {
    results, err := connect.Db.Query("SELECT * FROM albums")
    if err !=nil {
        panic(err.Error())
    }
    var albums []Album

    for results.Next() {
        var album Album
        if err := results.Scan(&album.ID, &album.Title, &album.Artist, &album.Price); err != nil {
          panic(err.Error())
        }
        albums = append(albums, album)
    }
    c.IndentedJSON(http.StatusOK, albums)
}
