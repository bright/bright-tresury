import { useLocation as useReactRouterLocation } from 'react-router-dom'
import { useCallback } from 'react'

export interface UseLocationResult {
    pathname: string
    search: string
    addSearchParam: (key: string, value: string) => string
    setSearchParam: (key: string, value: string) => string
    getSearchParam: (key: string) => string | null
}

export const useLocation = (): UseLocationResult => {
    const {pathname, search} = useReactRouterLocation()

    const makeUrl = (pathname: string, urlSearchParams: URLSearchParams) => `${pathname}?${urlSearchParams.toString()}`

    const addSearchParam = useCallback((key: string, value: string) => {
        const searchParams = new URLSearchParams(search)
        searchParams.set(key, value)
        return makeUrl(pathname, searchParams)
    }, [pathname, search])

    const setSearchParam = useCallback((key: string, value: string): string => {
        const searchParams = new URLSearchParams()
        searchParams.set(key, value)
        return makeUrl(pathname, searchParams)
    }, [pathname])

    const getSearchParam = useCallback((key: string) => new URLSearchParams(search).get(key), [search])

    return {pathname, search, addSearchParam, setSearchParam, getSearchParam}
}
