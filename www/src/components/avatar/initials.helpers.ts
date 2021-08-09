import { Nil } from '../../util/types'

export function getInitials(name: Nil<string>): string {
    if (!name) {
        return ''
    }
    return name.substr(0, 1).toUpperCase()
}
