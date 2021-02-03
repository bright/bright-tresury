import React, {DependencyList, useEffect, useState} from "react";

export enum LoadingState {
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

interface UseLoadingResult<T> {
    loadingState: LoadingState
    response?: T
}

export function useLoading<T>(apiCall: Promise<T>, deps?: DependencyList): UseLoadingResult<T> {
    const [response, setResponse] = useState<T>()
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading)

    useEffect(() => {
        apiCall
            .then((response: T) => {
                setResponse(response)
                setLoadingState(LoadingState.Resolved)
            })
            .catch(() => {
                setLoadingState(LoadingState.Error)
            })
    }, deps)

    return {loadingState, response} as UseLoadingResult<T>
}
