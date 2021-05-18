import React, { PropsWithChildren } from 'react'
import { Loader } from './Loader'
import { LoadingState } from './useLoading'
import { ErrorMessage } from '../error/ErrorMessage'

interface Props {
    loadingState: LoadingState
    errorMessage: string
}

export const LoadingWrapper = ({ loadingState, errorMessage, children }: PropsWithChildren<Props>) => {
    switch (loadingState) {
        case LoadingState.Initial:
            return null
        case LoadingState.Loading:
            return <Loader />
        case LoadingState.Resolved:
            return <>{children}</>
        case LoadingState.Error:
            return <ErrorMessage message={errorMessage} />
        default:
            return null
    }
}
