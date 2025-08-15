"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({ roomId }: { roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId)
        }

    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1000} height={800}></canvas>
        <div className="absolute right-0 flex gap-1">
            <div className="cursor-pointer hover:bg-slate-200 bg-white text-black p-2">Rect</div>
            <div className="cursor-pointer hover:bg-slate-200 bg-white text-black p-2">Circle</div>
        </div>
    </div>
}