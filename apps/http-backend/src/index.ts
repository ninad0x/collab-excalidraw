import express from "express"
import z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import { userMiddleware } from "./middleware"

const app = express()
app.use(express.json())


const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must contain atleast 3 characters"}).max(20),
    password: z.string().min(6, { message: "Password must contain atleast 6 characters"}).max(20),
})


app.post("/signup", (req, res) => {

    const { success, data, error } = signupSchema.safeParse(req.body)

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

    const { success, data, error } = signupSchema.safeParse(req.body)

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

    const { success, data, error } = signupSchema.safeParse(req.body)

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