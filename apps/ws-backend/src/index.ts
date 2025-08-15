import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket,
    userId: string,
    rooms: Number[]
}

const users: User[] = []

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
    
        if (typeof decoded === "string") {
            return null
        }
    
        if (!decoded || !decoded.userId) {
            return null
        }
        
        return decoded.userId;

    } catch (error) {
        return null
    }
}


wss.on('connection', function connection(ws: WebSocket, request) {

    const url = request.url;

    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get('token') ?? ""

    const userId = checkUser(token)

    if (userId == null) {
        ws.close()
        return
    }

    users.push({
        userId,
        rooms: [],
        ws
    })
    


    ws.on('message', async function message(data) {

        const parsedData = JSON.parse(data as any as string)

        // joining room
        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws)
            if (!user) {
                return;
            }
            
            if (user.rooms.includes(parsedData.roomId)) {
                return ws.send("Already in that room")
            }

            user.rooms.push(parsedData.roomId)
            console.log(user.userId ,user.rooms);
            
        }

        // leave room
        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws)
            if (!user) {
                return;
            }
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)
            console.log(user.rooms);

        }

        // send message
        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId
            const message = parsedData.message

            await prismaClient.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
                
        }

    })
})