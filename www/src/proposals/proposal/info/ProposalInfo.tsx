import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import PolkassemblyDescription from '../../../components/polkassemblyDescription/PolkassemblyDescription'
import { Label } from '../../../components/text/Label'
import IdeaProposalDetails from '../../../idea-proposal-details/details/IdeaProposalDetails'
import { ROUTE_EDIT_PROPOSAL } from '../../../routes/routes'
import { ProposalDto } from '../../proposals.dto'
import { useProposal } from '../useProposals'
import NoProposalDetails from './details/NoProposalDetails'

const useStyles = makeStyles(() =>
    createStyles({
        spacer: {
            marginTop: '2em',
        },

        markdownImg: {
            width: '100%',
        },
        polkassemblyButton: {
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
    const { canEdit } = useProposal(proposal)
    const history = useHistory()

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_PROPOSAL, { proposalIndex: proposal.proposalIndex }))
    }

    return (
        <div className={successfullyLoadedItemClasses.content}>
            {canEdit ? (
                <FormFooterButtonsContainer>
                    {proposal.details ? (
                        <FormFooterButton onClick={navigateToEdit}>{t('proposal.details.edit')}</FormFooterButton>
                    ) : (
                        <FormFooterButton onClick={navigateToEdit}>{t('proposal.details.add')}</FormFooterButton>
                    )}
                </FormFooterButtonsContainer>
            ) : null}
            <Label label={t('proposal.details.proposer')} />
            <AddressInfo address={proposer.address} ellipsed={false} />
            <Label className={classes.spacer} label={t('proposal.details.beneficiary')} />
            <AddressInfo address={beneficiary.address} ellipsed={false} />
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
