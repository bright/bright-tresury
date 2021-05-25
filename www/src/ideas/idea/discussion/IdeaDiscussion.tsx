import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

export const IdeaDiscussion = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    return <div className={classes.content}>Discussion</div>
}
