export function booleanFormat(value: any) {
    if (typeof value !== 'boolean') {
        throw new Error('must be a boolean')
    }
}
