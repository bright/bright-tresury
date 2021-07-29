import React from 'react'
import IdeaProposalDetails from '../../../idea-proposal-details/IdeaProposalDetails'
import { IdeaDto } from '../../ideas.dto'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaDetailsProps = OwnProps

const IdeaDetails = ({ idea }: IdeaDetailsProps) => {
    return <IdeaProposalDetails beneficiary={idea.beneficiary} details={idea.details} />
}

export default IdeaDetails
