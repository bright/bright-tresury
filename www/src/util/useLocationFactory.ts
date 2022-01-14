import { useLocation } from 'react-router-dom'

export default () => {
    const {pathname, search} = useLocation()
    const setSearchParam = (key: string, value: string, preserve: boolean=false): string => {
        const searchParams = preserve ? new URLSearchParams(search) : new URLSearchParams()
        searchParams.set(key, value)
        return `${pathname}?${searchParams.toString()}`
    }
    const getSearchParam= (key: string) => {
        return new URLSearchParams(search).get(key)
    }
    return {pathname, search, setSearchParam, getSearchParam}
}
