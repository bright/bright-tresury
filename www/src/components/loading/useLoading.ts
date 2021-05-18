import { useCallback, useEffect, useRef, useState } from 'react'
import { ErrorType, useError } from '../error/useError'

export enum LoadingState {
    Initial,
    Loading,
    Error,
    Resolved,
}

interface UseLoadingResult<ParamsType, ResponseType> {
    call: (params: ParamsType) => Promise<void>
    loadingState: LoadingState
    response?: ResponseType
    error: ErrorType
}

export function useLoading<ParamsType, ResponseType>(
    apiCall: (params: ParamsType) => Promise<ResponseType>,
): UseLoadingResult<ParamsType, ResponseType> {
    const ref = useRef(true)

    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

    const [response, setResponse] = useState<ResponseType>()

    const { error, setError } = useError()

    const call = useCallback(
        async (params: ParamsType) => {
            setLoadingState(LoadingState.Loading)
            return apiCall(params)
                .then((response) => {
                    if (!ref.current) return
                    setResponse(response)
                    setLoadingState(LoadingState.Resolved)
                    return response
                })
                .catch((err: ErrorType) => {
                    if (!ref.current) return
                    setError(err)
                    setLoadingState(LoadingState.Error)
                    throw err
                })
        },
        [apiCall],
    )

    useEffect(() => {
        return () => {
            ref.current = false
        }
    }, [])

    return { loadingState, response, call, error } as UseLoadingResult<ParamsType, ResponseType>
}
