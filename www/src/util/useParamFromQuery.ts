import { useCallback, useMemo } from 'react'
import { useLocation } from './useLocation'

export interface UseParamFromQueryResult<E> {
    param: E[keyof E],
    setParam: (param: string) => string
}
interface OwnProps<E> {
    enumObject: E
    paramName: string,
    defaultValue: E[keyof E]
    preserveParam: boolean
}
export type UseParamFromQueryProps<E> = OwnProps<E>

export const useParamFromQuery = <E>({ enumObject, paramName, defaultValue, preserveParam }: UseParamFromQueryProps<E>): UseParamFromQueryResult<E>  => {
    const { getSearchParam, addSearchParam, setSearchParam } = useLocation()

    const setParam = useCallback((param: string) => {
        const modifyFunction = preserveParam ? addSearchParam : setSearchParam
        return modifyFunction(paramName , param)
    },[preserveParam, addSearchParam, setSearchParam])

    const param = useMemo(() => {
        const filterParam = getSearchParam(paramName)
        const filterValue = Object.values(enumObject).find(value => value === filterParam)
        return filterValue ?? defaultValue
    }, [getSearchParam, paramName, enumObject, defaultValue])
    return { param, setParam }
}
