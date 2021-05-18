import React, { PropsWithChildren } from 'react'
import { Loader } from './Loader'
import { LoadingState } from './useLoading'
import { ErrorText } from '../error/ErrorText'

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
            return <ErrorText error={errorMessage} />
        default:
            return null
    }
}
