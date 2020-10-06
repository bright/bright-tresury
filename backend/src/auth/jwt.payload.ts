export function parseAccountId(payload: JwtPayload) {
    const sub = payload.sub
    return sub.replace(/^aid:/, '');
}

export interface JwtPayload {
    sub: string
}

export function formatAccountId(accountId: string) {
    return `aid:${accountId}`
}
