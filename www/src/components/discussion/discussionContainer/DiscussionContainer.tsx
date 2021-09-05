import React, { PropsWithChildren } from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../loading/useSuccessfullyLoadedItemStyles'

interface OwnProp {}

export type DiscussionContainerProps = PropsWithChildren<OwnProp>

const DiscussionContainer = ({ children }: DiscussionContainerProps) => {
    const classes = useSuccessfullyLoadedItemStyles()
    return <div className={classes.content}>{children}</div>
}

export default DiscussionContainer
