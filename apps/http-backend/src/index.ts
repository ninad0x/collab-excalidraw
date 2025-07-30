import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { userMiddleware } from "./middleware"
import { CreateRoomSchema, CreateUserSchema } from "@repo/common/types"


const app = express()
app.use(express.json())


app.post("/signup", (req, res) => {

    const { success, data, error } = CreateUserSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues[0]?.message
        })
    }

    return res.json({
        message: "Signup success"
    })
    
})


app.post("/signin", (req, res) => {

    const { success, data, error } = CreateUserSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues.map(e => e.message)
        })
    }

    const userId = 1
    const token = jwt.sign({
        userId
    }, JWT_SECRET)


    return res.json({
        token
    })
    
})


app.post("/room", userMiddleware, (req, res) => {

    const { success, data, error } = CreateRoomSchema.safeParse(req.body)

    if (!success) {
        return res.json({
            message: error.issues[0]?.message
        })
    }

    return res.json({
        roomId: 123
    })
    
})

app.listen(3001)