"use client"

import { useEffect, useRef } from "react"

/**
 * 
 * @param callback 
 * @param time In miliseconds
 */
export default function useThrottle<T extends Function>(callback: T, time: number = 2000) {
    const lastRun = useRef(Date.now())

    return function() {
        if (Date.now() - lastRun.current <= time) return;
        lastRun.current = Date.now()
        return callback()
    }
}