import React from 'react'
import { useProposalStyles } from '../Proposal'

const ProposalDiscussion = () => {
    const classes = useProposalStyles()
    return <div className={classes.content}>Discussion</div>
}

export default ProposalDiscussion
