package models

import (
	connect "backend/initializers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Announcement struct {
	AnnouncementID   int     `json:"announcement_id"`
	BranchID         string  `json:"branch_id"`
	ProductID        *string `json:"product_id,omitempty"`
	AnnouncementType string  `json:"announcement_type"`
	AnnouncementText string  `json:"announcement_text"`
	AnnouncementTime string  `json:"announcement_time"`
}

func GetAnnouncements(c *gin.Context) {
	rows, err := connect.Db.Query("SELECT announcement_id, branch_id, product_id, announcement_type, announcement_text, announcement_time FROM Announcement_Table")
	if err != nil {
		log.Println("Error querying announcements:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query database"})
		return
	}
	defer rows.Close()

	var announcements []Announcement

	for rows.Next() {
		var announcement Announcement
		if err := rows.Scan(&announcement.AnnouncementID, &announcement.BranchID, &announcement.ProductID, &announcement.AnnouncementType, &announcement.AnnouncementText, &announcement.AnnouncementTime); err != nil {
			log.Println("Error reading announcement data:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read data"})
			return
		}
		announcements = append(announcements, announcement)
	}

	if len(announcements) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No announcements found"})
		return
	}

	c.JSON(http.StatusOK, announcements)
}
