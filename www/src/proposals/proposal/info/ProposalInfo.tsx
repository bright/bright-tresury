import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Identicon from '../../../components/identicon/Identicon'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import IdeaProposalDetails from '../../../idea-proposal-details/IdeaProposalDetails'
import { breakpoints } from '../../../theme/theme'
import { ellipseTextInTheMiddle } from '../../../util/stringUtil'
import { ProposalDto } from '../../proposals.dto'

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
        longText: {
            padding: '20px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 400,
            width: '70%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                padding: '16px',
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '10px',
                fontSize: '14px',
            },
        },
        spacing: {
            marginTop: '2em',
        },
        proposer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '28px',
        },
        accountValue: {
            marginLeft: '.5em',
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalInfoProps = OwnProps

const ProposalInfo = ({ proposal: { proposer, beneficiary, details } }: ProposalInfoProps) => {
    const successfullyLoadedItemClasses = useSuccessfullyLoadedItemStyles()
    const classes = useStyles()

    const { t } = useTranslation()

    return (
        <div className={successfullyLoadedItemClasses.content}>
            <Label label={t('proposal.content.info.proposer')} />
            <div className={classes.proposer}>
                <>
                    <Identicon address={proposer.address} />
                    <div className={`${classes.accountValue} ${classes.text}`}>{proposer.address}</div>
                </>
            </div>
            <IdeaProposalDetails beneficiary={beneficiary.address} details={details} />
        </div>
    )
}
export default ProposalInfo
