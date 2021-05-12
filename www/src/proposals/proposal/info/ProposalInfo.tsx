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
    const { t } = useTranslation()

    const classes = useStyles()

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
            </div>

            <div className={classes.spacing}>
                <Label label={t('proposal.content.info.reasonForIdea')} />
            </div>

            {proposal.ideaMilestoneId ? (
                <div className={classes.spacing}>
                    <Label label={t('proposal.content.info.description')} />
                </div>
            ) : null}
        </div>
    )
}
