import express from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { userMiddleware } from "./middleware"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient }  from "@repo/db/client"


const app = express()
app.use(express.json())


app.post("/signup", async (req, res) => {

    const { success, data, error } = CreateUserSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues.map(e => e.message)
        })
    }
    
    try {
        const user = await prismaClient.user.create({
            data : {
                email: data.email,
                password: data.password,   // TODO : hash pasword
                name: data.name
            }
        })

        return res.json({
            userId: user.id
        })
    
    } catch (e) {
        return res.status(403).json({
            message: "email taken"
        })
    }
})


app.post("/signin", async (req, res) => {

    const { success, data, error } = SigninSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues.map(e => e.message)
        })
    }

    // TODO : compare hash pasword

    const user = await prismaClient.user.findFirst({
        where: {
            email: data.email,
            password: data.password
        }
    })

    if (!user) {
        return res.json({
            message: "User does not exist, pls signup"
        })
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET)

    return res.json({
        token
    })
    
})


app.post("/room", userMiddleware, async (req, res) => {

    const { success, data, error } = CreateRoomSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues[0]?.message
        })
    }

    // @ts-ignore
    const userId = req.userId

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: data.name,
                adminId: userId
            }
        })
    
        return res.json({
            roomId: room.id
        })
        
    } catch (error) {
        res.status(411).json({
            message: "Room name must be unique"
        })
    }
    
})

app.listen(3001)