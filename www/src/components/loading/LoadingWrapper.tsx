import React, {DependencyList, useEffect, useState} from "react";

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

interface UseLoadingResult<T, U, V> {
    call: (params: T) => Promise<void>
    loadingState: LoadingState
    response?: U
    error?: V
}

export function useLoading<T, U, V>(apiCall: (params: T) => Promise<U>): UseLoadingResult<T, U, V> {
    const [response, setResponse] = useState<U>()
    const [error, setError] = useState<V>()
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

    const call = async (params: T) => {
        setLoadingState(LoadingState.Loading)
        return apiCall(params)
            .then((response) => {
                setResponse(response)
                setLoadingState(LoadingState.Resolved)
            })
            .catch((err: V) => {
                setError(err)
                setLoadingState(LoadingState.Error)
            })
    }

    return {loadingState, response, call, error} as UseLoadingResult<T, U, V>
}
