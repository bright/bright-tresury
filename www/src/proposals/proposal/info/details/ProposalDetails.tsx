import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InformationTip from '../../../../components/info/InformationTip'
import IdeaProposalDetails from '../../../../idea-proposal-details/details/IdeaProposalDetails'
import { ProposalDto } from '../../../proposals.dto'
import { useProposal } from '../../useProposals'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '2em',
            flexGrow: 1,
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalDetailsProps = OwnProps

const ProposalDetails = ({ proposal: { details }, proposal }: ProposalDetailsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isEditable } = useProposal(proposal)

    const informationTipLabel = isEditable
        ? t('proposal.details.noProposalDetails.askToAddDescription')
        : t('proposal.details.noProposalDetails.cannotEdit')

    return (
        <div className={classes.root}>
            {details ? <IdeaProposalDetails details={details} /> : <InformationTip label={informationTipLabel} />}
        </div>
    )
}
export default ProposalDetails
