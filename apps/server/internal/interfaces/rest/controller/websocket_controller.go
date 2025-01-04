package controller

import (
	"encoding/json"
	ws "server/internal/infra/websocket"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

type websocketController struct {
	room_manager *ws.RoomManager
	eventService *ws.EventService
}

func NewWebsocketController() *websocketController {
	rm := ws.NewRoomManager()
	es := ws.GetEventService()
	es.SetRoomManager(rm)

	return &websocketController{
		room_manager: rm,
		eventService: es,
	}
}

func (wc *websocketController) HandleConnection(ctx echo.Context) error {
	room_manager := wc.room_manager

	wsHandler := websocket.Handler(func(conn *websocket.Conn) {
		defer conn.Close()
		defer room_manager.RemoveClientFromAllRooms(conn)

		var current_room *ws.Room

		for {
			var msg string
			err := websocket.Message.Receive(conn, &msg)
			if err != nil {
				break
			}

			var event ws.Event
			if err := json.Unmarshal([]byte(msg), &event); err != nil {
				continue
			}

			switch event.Type {
			case "join":
				if current_room != nil {
					current_room.RemoveClient(conn)
				}
				current_room = wc.room_manager.GetOrCreateRoom(event.Room_id)
				current_room.AddClient(conn)

			case "leave":
				if current_room != nil {
					current_room.RemoveClient(conn)
					current_room = nil
				}
			}

		}

	})

	wsHandler.ServeHTTP(ctx.Response(), ctx.Request())
	return nil
}
