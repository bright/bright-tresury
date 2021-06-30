export function arrayFormat(value: any) {
    if (!Array.isArray(value)) {
        throw new Error('must be of type Array')
    }
}
