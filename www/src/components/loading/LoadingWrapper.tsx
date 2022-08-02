import React, { PropsWithChildren } from 'react'
import Loader from './Loader'
import Error from '../error/Error'
import { QueryStatus } from 'react-query'

interface OwnProps {
    status: QueryStatus
    errorText: string
    loadingText: string
    list?: boolean
}
export type LoadingWrapperProps = PropsWithChildren<OwnProps>
const LoadingWrapper = ({ status, errorText, loadingText, children, list }: LoadingWrapperProps) => {
    switch (status) {
        case 'idle':
            return null
        case 'loading':
            return <Loader text={loadingText} list={list} />
        case 'success':
            return <>{children}</>
        case 'error':
            return <Error text={errorText} />
        default:
            return null
    }
}
export default LoadingWrapper
