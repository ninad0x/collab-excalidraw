import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string) {

    const existingShapes: Shape[] = await getExistingShapes(roomId)

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return
    }

    clearCanvas(existingShapes, canvas, ctx)

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.clientX
        startY = e.clientY        
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false
        const width = e.clientX - startX
        const height = e.clientY - startY
        
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        })

        console.log(existingShapes);

    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX
            const height = e.clientY - startY
            clearCanvas(existingShapes, canvas, ctx)
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height)

        }
    })

}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // render existing shapes
    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height) 
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages;

    const shapes = messages.map((x: any) => {
        const messageData = JSON.parse(x.message)
        return messageData;
    })

    return shapes;
}