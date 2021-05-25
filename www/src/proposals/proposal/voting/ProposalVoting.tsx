import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

const ProposalVoting: React.FC = () => {
    const classes = useSuccessfullyLoadedItemStyles()
    return <div className={classes.content}>Voting</div>
}

export default ProposalVoting
