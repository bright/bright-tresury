import { arrayFormat } from './array.format'

export function notEmptyArrayFormat(value: any) {
    arrayFormat(value)
    if (!value.length) {
        throw new Error('must have at least one element')
    }
}
