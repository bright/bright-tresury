import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import PolkassemblyDescription from '../../../components/polkassemblyDescription/PolkassemblyDescription'
import { Label } from '../../../components/text/Label'
import IdeaProposalDetails from '../../../idea-proposal-details/details/IdeaProposalDetails'
import { ProposalDto } from '../../proposals.dto'
import NoProposalDetails from './details/NoProposalDetails'
import User from '../../../components/user/User'

const useStyles = makeStyles(() =>
    createStyles({
        spacer: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalInfoProps = OwnProps

const ProposalInfo = ({ proposal: { proposer, beneficiary, polkassembly }, proposal }: ProposalInfoProps) => {
    const successfullyLoadedItemClasses = useSuccessfullyLoadedItemStyles()
    const classes = useStyles()

    const { t } = useTranslation()

    return (
        <div className={successfullyLoadedItemClasses.content}>
            <Label label={t('proposal.details.proposer')} />
            <User user={proposer} ellipsis={false} />
            <Label className={classes.spacer} label={t('proposal.details.beneficiary')} />
            <User user={beneficiary} ellipsis={false} />
            {proposal.details ? (
                <IdeaProposalDetails details={proposal.details} />
            ) : (
                <NoProposalDetails proposal={proposal} />
            )}
            <PolkassemblyDescription polkassemblyPostDto={polkassembly} initialShow={!proposal.details} />
        </div>
    )
}
export default ProposalInfo
