import React from 'react'
import Identicon from '../../../components/identicon/Identicon'
import { ProposalDto } from '../../proposals.dto'
import { Label } from '../../../components/text/Label'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import { Theme } from '@material-ui/core'
import { ellipseTextInTheMiddle } from '../../../util/stringUtil'
import Placeholder from '../../../components/text/Placeholder'
import { useGetIdea } from '../../../ideas/ideas.api'
import { useGetIdeaMilestone } from '../../../ideas/idea/milestones/idea.milestones.api'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

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

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalInfoProps = OwnProps

const ProposalInfo = ({
    proposal: { proposer, isCreatedFromIdeaMilestone, ideaId, ideaMilestoneId },
}: ProposalInfoProps) => {
    const successfullyLoadedItemClasses = useSuccessfullyLoadedItemStyles()
    const classes = useStyles()

    const { t } = useTranslation()

    const { data: idea } = useGetIdea(ideaId!, {
        enabled: ideaId !== undefined,
    })

    const { data: ideaMilestone } = useGetIdeaMilestone(ideaId!, ideaMilestoneId!, {
        enabled: ideaId !== undefined && ideaMilestoneId !== undefined,
    })

    return (
        <div className={successfullyLoadedItemClasses.content}>
            <Label label={t('proposal.content.info.proposer')} />
            <div className={classes.proposer}>
                <>
                    <Identicon address={proposer.address} />
                    <div className={`${classes.accountValue} ${classes.text}`}>
                        {ellipseTextInTheMiddle(proposer.address)}
                    </div>
                </>
            </div>

            <div className={classes.spacing}>
                <Label label={t('proposal.content.info.fieldOfIdea')} />
                <div className={classes.text}>
                    {idea?.field ? idea.field : <Placeholder value={t('proposal.content.info.fieldOfIdea')} />}
                </div>
            </div>

            <div className={classes.spacing}>
                <Label label={t('proposal.content.info.reasonForIdea')} />
                <div className={classes.longText}>
                    {idea ? idea.content : <Placeholder value={t('proposal.content.info.reasonForIdea')} />}
                </div>
            </div>

            {isCreatedFromIdeaMilestone ? (
                <div className={classes.spacing}>
                    <Label label={t('proposal.content.info.description')} />
                    <div className={classes.longText}>
                        {ideaMilestone ? (
                            ideaMilestone.description
                        ) : (
                            <Placeholder value={t('proposal.content.info.description')} />
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
export default ProposalInfo
