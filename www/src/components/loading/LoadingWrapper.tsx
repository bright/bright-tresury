import React, { PropsWithChildren } from 'react'
import { Loader } from './Loader'
import { Error } from '../error/Error'
import { QueryStatus } from 'react-query'

export interface LoadingWrapperProps {
    status: QueryStatus
    errorText: string
    loadingText: string
}

export const LoadingWrapper = ({
    status,
    errorText,
    loadingText,
    children,
}: PropsWithChildren<LoadingWrapperProps>) => {
    switch (status) {
        case 'idle':
            return null
        case 'loading':
            return <Loader text={loadingText} />
        case 'success':
            return <>{children}</>
        case 'error':
            return <Error text={errorText} />
        default:
            return null
    }
}
