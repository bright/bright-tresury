import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InformationTip from '../../../../components/info/InformationTip'
import { ProposalDto } from '../../../proposals.dto'
import { useProposal } from '../../useProposals'

const useStyles = makeStyles(() =>
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

export type NoProposalDetailsProps = OwnProps

const NoProposalDetails = ({ proposal }: NoProposalDetailsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isEditable, canEdit } = useProposal(proposal)

    const informationTipLabel = isEditable
        ? t('proposal.details.noProposalDetails.askToAddDescription')
        : t('proposal.details.noProposalDetails.cannotEdit')

    return (
        <div className={classes.root}>
            {canEdit ? (
                <InformationTip label={t('proposal.details.noProposalDetails.canEdit')} />
            ) : (
                <InformationTip label={informationTipLabel} />
            )}
        </div>
    )
}
export default NoProposalDetails
