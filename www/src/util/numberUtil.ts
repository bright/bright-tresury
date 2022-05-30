/**
 * It formats large numbers, so that thousands are separate by commas.
 * @param value
 */
import { Nil } from './types'

export function formatNumber(value: number): string {
    return value.toLocaleString()
}

export function isNumber(value?: Nil<string>): boolean {
    if (typeof value !== 'string') {
        return false
    }
    if (value.trim() === '') {
        return false
    }
    return !isNaN(Number(value))
}
