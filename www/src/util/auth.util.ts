const AUTH_KEY = 'auth'

export function setAuthorized(authorized: boolean) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authorized))
}

export function isAuthorized(): boolean {
    const authorized = localStorage.getItem(AUTH_KEY)
    return authorized ? JSON.parse(authorized) as boolean : false
}
