package connect

import(
  "fmt"
  "log"
  "database/sql"
  "os"
  "github.com/joho/godotenv"
  _ "github.com/go-sql-driver/mysql"
)

var Db *sql.DB
func ConnectDB(){
  err:=godotenv.Load()
  if err != nil {
        log.Fatal("Error loading .env file")
  }
  Db, err = sql.Open("mysql",os.Getenv("DB_URL"))


  fmt.Println(os.Getenv("DB_URL"))
    if err != nil {
        panic(err.Error())
    }else{
      fmt.Println("Success")
    }
}
