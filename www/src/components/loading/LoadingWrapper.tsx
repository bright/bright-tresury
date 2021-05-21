import React, { PropsWithChildren } from 'react'
import { Loader } from './Loader'
import { ErrorText } from '../error/ErrorText'
import { QueryStatus } from 'react-query'

export interface LoadingWrapperProps {
    status: QueryStatus
    error: string
}

export const LoadingWrapper = ({ status, error, children }: PropsWithChildren<LoadingWrapperProps>) => {
    switch (status) {
        case 'idle':
            return null
        case 'loading':
            return <Loader />
        case 'success':
            return <>{children}</>
        case 'error':
            return <ErrorText error={error} />
        default:
            return null
    }
}
