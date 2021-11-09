import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import { ProposalDto } from '../../proposals.dto'
import { useProposal } from '../useProposals'
import ProposalDetails from './details/ProposalDetails'
import AddProposalDetails from './form/AddProposalDetails'
import EditProposalDetails from './form/EditProposalDetails'
import ReactMarkdown from 'react-markdown'
import Button from '../../../components/button/Button'

const useStyles = makeStyles(() =>
    createStyles({
        spacer: {
            marginTop: '2em',
        },

        markdownImg: {
            width: '100%'
        },
        polkassemblyButton: {
            marginTop: '2em'
        }
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
    const [showPolkassemblyDescription, setShowPolkassemblyDescription] = useState(!Boolean(proposal.details))
    const toggleShowPolkassemblyDescription = () => setShowPolkassemblyDescription(!showPolkassemblyDescription)
    const renderDetails = () => {
        if (!canEdit) {
            return <ProposalDetails proposal={proposal} />
        }
        if (!proposal.details) {
            return <AddProposalDetails proposal={proposal} />
        } else {
            return <EditProposalDetails proposal={proposal} />
        }
    }
    const renderPolkassemblyContent = () => {
        if(!polkassembly?.content)
            return

        return (
            <>
                <Button
                    onClick={toggleShowPolkassemblyDescription}
                    variant="text"
                    color="primary"
                    className={classes.polkassemblyButton}
                >
                    {t(
                        showPolkassemblyDescription
                            ? 'proposal.details.polkassemblyDescription.hide'
                            : 'proposal.details.polkassemblyDescription.show'
                    )}
                </Button>
                {
                    showPolkassemblyDescription
                        ? <ReactMarkdown components={{ img: ({node, ...props}) => <img className={classes.markdownImg} {...props}/> }}>
                            {polkassembly.content}
                        </ReactMarkdown>
                        : null
                }
            </>
        )
    }
    return (
        <div className={successfullyLoadedItemClasses.content}>
            <Label label={t('proposal.content.info.proposer')} />
            <AddressInfo address={proposer.address} ellipsed={false} />
            <Label className={classes.spacer} label={t('proposal.content.info.beneficiary')} />
            <AddressInfo address={beneficiary.address} ellipsed={false} />
            {renderDetails()}
            {renderPolkassemblyContent()}
        </div>
    )
}
export default ProposalInfo
