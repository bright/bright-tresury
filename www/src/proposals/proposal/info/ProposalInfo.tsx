import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Identicon from '../../../components/identicon/Identicon'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import { breakpoints } from '../../../theme/theme'
import { ProposalDto } from '../../proposals.dto'
import { useProposal } from '../useProposals'
import ProposalDetails from './details/ProposalDetails'
import ProposalEdit from './form/ProposalEdit'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px',
            },
        },
        addressContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        spacer: {
            marginTop: '2em',
        },
        address: {
            marginLeft: '.5em',
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalInfoProps = OwnProps

const ProposalInfo = ({ proposal: { proposer, beneficiary, details }, proposal }: ProposalInfoProps) => {
    const successfullyLoadedItemClasses = useSuccessfullyLoadedItemStyles()
    const classes = useStyles()

    const { t } = useTranslation()
    const { canEditProposal } = useProposal(proposal)

    return (
        <div className={successfullyLoadedItemClasses.content}>
            <Label label={t('proposal.content.info.proposer')} />
            <div className={classes.addressContainer}>
                <>
                    <Identicon address={proposer.address} />
                    <div className={`${classes.address} ${classes.text}`}>{proposer.display ?? proposer.address}</div>
                </>
            </div>
            <Label className={classes.spacer} label={t('proposal.content.info.beneficiary')} />
            <div className={classes.addressContainer}>
                <>
                    <Identicon address={beneficiary.address} />
                    <div className={clsx(classes.address, classes.text)}>
                        {beneficiary.display ?? beneficiary.address}
                    </div>
                </>
            </div>
            {canEditProposal ? <ProposalEdit proposal={proposal} /> : <ProposalDetails proposal={proposal} />}
        </div>
    )
}
export default ProposalInfo
