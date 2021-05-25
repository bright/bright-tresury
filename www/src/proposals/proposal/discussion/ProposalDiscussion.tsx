import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

const ProposalDiscussion = () => {
    const classes = useSuccessfullyLoadedItemStyles()
    return <div className={classes.content}>Discussion</div>
}

export default ProposalDiscussion
