export function getInitials(name?: string): string {
    if (!name || name.length === 0) {
        return ''
    }
    return name.substr(0, 1).toUpperCase()
}
