import React, {useCallback, useState} from "react";

export enum LoadingState {
    Initial,
    Loading,
    Error,
    Resolved
}

interface Props {
    loadingState: LoadingState
}

export const LoadingWrapper: React.FC<Props> = ({loadingState, children}) => {
    return <>
        {/* TODO: add loading indicator and handle errors */}
        {loadingState === LoadingState.Loading && <p>Loading</p>}
        {loadingState === LoadingState.Error && <p>Error</p>}
        {loadingState === LoadingState.Resolved && children}
    </>
}

interface UseLoadingResult<ParamsType, ResponseType, ErrorType> {
    call: (params: ParamsType) => Promise<void>
    loadingState: LoadingState
    response?: ResponseType
    error?: ErrorType
}

export function useLoading<ParamsType, ResponseType, ErrorType>(apiCall: (params: ParamsType) => Promise<ResponseType>): UseLoadingResult<ParamsType, ResponseType, ErrorType> {
    const [response, setResponse] = useState<ResponseType>()
    const [error, setError] = useState<ErrorType>()
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

    const call = useCallback(async (params: ParamsType) => {
        setLoadingState(LoadingState.Loading)
        return apiCall(params)
            .then((response) => {
                setResponse(response)
                setLoadingState(LoadingState.Resolved)
            })
            .catch((err: ErrorType) => {
                setError(err)
                setLoadingState(LoadingState.Error)
            })
    }, [apiCall])

    return {loadingState, response, call, error} as UseLoadingResult<ParamsType, ResponseType, ErrorType>
}
