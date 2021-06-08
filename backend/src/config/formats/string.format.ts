export function stringFormat(value: any) {
    if (typeof value !== 'string') {
        throw new Error('must be a string')
    }
}
