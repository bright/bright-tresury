export function numberFormat(value: any) {
    if (typeof value !== 'number') {
        throw new Error('must be a number')
    }
}
