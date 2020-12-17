export function ellipseTextInTheMiddle(value: string, visibleCharacters: number = 12): string {
    if (value.length > visibleCharacters && visibleCharacters > 0) {
        const prefix = value.substring(0, visibleCharacters / 2)
        const suffix = value.substring(value.length - (visibleCharacters / 2))
        return `${prefix}...${suffix}`
    } else {
        return value
    }
}
