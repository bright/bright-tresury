export function getInitials(name?: string): string {
    if (!name) {
        return ''
    }
    return name.substr(0, 1).toUpperCase()
}
