export function objectFormat(value: any) {
    if (typeof value !== 'object') {
        throw new Error('must be an object')
    }
}
