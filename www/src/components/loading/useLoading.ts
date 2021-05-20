import { useCallback, useEffect, useRef, useState } from 'react'

export enum LoadingState {
    Initial,
    Loading,
    Error,
    Resolved,
}

interface UseLoadingResult<ParamsType, ResponseType, ErrorType> {
    call: (params: ParamsType) => Promise<void>
    loadingState: LoadingState
    response?: ResponseType
    error: ErrorType
}

export function useLoading<ParamsType, ResponseType, ErrorType>(
    apiCall: (params: ParamsType) => Promise<ResponseType>,
): UseLoadingResult<ParamsType, ResponseType, ErrorType> {
    const ref = useRef(true)

    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

    const [response, setResponse] = useState<ResponseType>()

    const [error, setError] = useState<ErrorType>()

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

    return { loadingState, response, call, error } as UseLoadingResult<ParamsType, ResponseType, ErrorType>
}
