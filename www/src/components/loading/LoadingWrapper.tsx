import React from "react";

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
