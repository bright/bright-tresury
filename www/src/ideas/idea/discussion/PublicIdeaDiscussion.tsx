import React, { useMemo } from 'react'
import { IdeaDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import AlreadyTurnedIntoProposal from './AlreadyTurnedIntoProposal'

interface OwnProps {
    idea: IdeaDto
    discussion: IdeaDiscussionDto
}
export type PublicIdeaDiscussionProps = OwnProps

const PublicIdeaDiscussion = ({ idea, discussion }: PublicIdeaDiscussionProps) => {
    const info =
        idea.status === IdeaStatus.TurnedIntoProposal ? (
            <AlreadyTurnedIntoProposal proposalIndex={idea.currentNetwork.blockchainProposalId!} />
        ) : null

    return <Discussion discussion={discussion} info={info} discussedEntity={idea} />
}
export default PublicIdeaDiscussion
