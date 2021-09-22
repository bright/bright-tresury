import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Status from '../../../components/status/Status'
import { useNetworks } from '../../../networks/useNetworks'
import { theme } from '../../../theme/theme'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        otherStatus: {
            paddingLeft: '6px',
        },
        spacer: {
            marginLeft: '8px',
            borderWidth: '0 0 0 1px',
            borderStyle: 'solid',
            borderColor: theme.palette.text.disabled,
            height: '12px',
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
}

export type IdeaStatusIndicatorProps = OwnProps

const IdeaStatusIndicator = ({ idea: { currentNetwork, additionalNetworks }, idea }: IdeaStatusIndicatorProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { networks } = useNetworks()

    const getStatusTranslationKey = (status: IdeaStatus): string => {
        switch (status) {
            case IdeaStatus.Draft:
                return 'idea.list.card.statusDraft'
            case IdeaStatus.Active:
                return 'idea.list.card.statusActive'
            case IdeaStatus.TurnedIntoProposal:
                return 'idea.list.card.statusTurnedIntoProposal'
            case IdeaStatus.Pending:
                return 'idea.list.card.pending'
            case IdeaStatus.MilestoneSubmission:
                return 'idea.list.card.milestoneSubmission'
            case IdeaStatus.Closed:
                return 'idea.list.card.statusClosed'
        }
    }

    const getStatusColor = (status: IdeaStatus): string => {
        switch (status) {
            case IdeaStatus.Draft:
                return theme.palette.status.draft
            case IdeaStatus.Active:
                return theme.palette.status.active
            case IdeaStatus.TurnedIntoProposal:
                return theme.palette.status.turnedIntoProposal
            case IdeaStatus.Pending:
                return theme.palette.status.pending
            case IdeaStatus.MilestoneSubmission:
                return theme.palette.status.milestoneSubmission
            case IdeaStatus.Closed:
                return theme.palette.status.closed
        }
    }

    const otherStatus =
        idea.status === IdeaStatus.TurnedIntoProposal ? IdeaStatus.Pending : IdeaStatus.TurnedIntoProposal

    const otherStatusNetworksNames = additionalNetworks
        .filter((n) => n.status !== currentNetwork.status)
        .map((n) => networks.find((network) => network.id === n.name)?.name ?? n.name)
        .join(', ')

    return (
        <div className={classes.root}>
            <Status label={t(getStatusTranslationKey(idea.status))} color={getStatusColor(idea.status)} />
            {otherStatusNetworksNames.length > 0 ? (
                <>
                    <div className={classes.spacer} />
                    <Status
                        className={classes.otherStatus}
                        label={t(getStatusTranslationKey(otherStatus))}
                        color={getStatusColor(otherStatus)}
                        sublabel={`(${otherStatusNetworksNames})`}
                    />
                </>
            ) : null}
        </div>
    )
}

export default IdeaStatusIndicator
