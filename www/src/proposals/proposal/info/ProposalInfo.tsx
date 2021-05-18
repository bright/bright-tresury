import React from 'react'
import { ProposalDto } from '../../proposals.api'
import { Label } from '../../../components/text/Label'
import { Identicon } from '../../../components/identicon/Identicon'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import { Theme } from '@material-ui/core'
import { ellipseTextInTheMiddle } from '../../../util/stringUtil'
import { Placeholder } from '../../../components/text/Placeholder'
import { useProposalInfo } from './useProposalInfo'

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
        },
        accountValue: {
            marginLeft: '.5em',
        },
    }),
)

interface Props {
    proposal: ProposalDto
}

export const ProposalInfo = ({ proposal }: Props) => {
    const classes = useStyles()

    const { t } = useTranslation()

    const { field, reason, description } = useProposalInfo(proposal)

    return (
        <div>
            <Label label={t('proposal.content.info.proposer')} />
            <div className={classes.proposer}>
                <>
                    <Identicon address={proposal.proposer} />
                    <div className={`${classes.accountValue} ${classes.text}`}>
                        {ellipseTextInTheMiddle(proposal.proposer)}
                    </div>
                </>
            </div>

            <div className={classes.spacing}>
                <Label label={t('proposal.content.info.fieldOfIdea')} />
                <div className={classes.text}>
                    {field || <Placeholder value={t('proposal.content.info.fieldOfIdea')} />}
                </div>
            </div>

            <div className={classes.spacing}>
                <Label label={t('proposal.content.info.reasonForIdea')} />
                <div className={classes.longText}>
                    {reason || <Placeholder value={t('proposal.content.info.reasonForIdea')} />}
                </div>
            </div>

            {proposal.isCreatedFromIdeaMilestone ? (
                <div className={classes.spacing}>
                    <Label label={t('proposal.content.info.description')} />
                    <div className={classes.longText}>
                        {description || <Placeholder value={t('proposal.content.info.description')} />}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
