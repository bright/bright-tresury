import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import InformationTip from '../../../components/info/InformationTip'
import Status from '../../../components/status/Status'
import { useNetworks } from '../../../networks/useNetworks'
import { theme } from '../../../theme/theme'
import { IdeaNetworkDto, IdeaNetworkStatus } from '../../ideas.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: '8px',
        },
        tip: {
            marginLeft: '12px',
        },
    }),
)

interface OwnProps {
    ideaNetwork: IdeaNetworkDto
    isOwner: boolean
}

export type IdeaNetworkStatusIndicatorProps = OwnProps

const IdeaNetworkStatusIndicator = ({ ideaNetwork: { status, name }, isOwner }: IdeaNetworkStatusIndicatorProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { networks } = useNetworks()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case IdeaNetworkStatus.Active:
                return 'idea.details.form.networks.status.active'
            case IdeaNetworkStatus.TurnedIntoProposal:
                return 'idea.details.form.networks.status.turnedIntoProposal'
            case IdeaNetworkStatus.Pending:
                return 'idea.details.form.networks.status.pending'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case IdeaNetworkStatus.Active:
                return theme.palette.status.active
            case IdeaNetworkStatus.TurnedIntoProposal:
                return theme.palette.status.turnedIntoProposal
            case IdeaNetworkStatus.Pending:
                return theme.palette.status.pending
        }
    }

    const networkName = networks.find((n) => n.id === name)?.name ?? name

    return (
        <div className={classes.root}>
            <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
            {status === IdeaNetworkStatus.Pending && isOwner ? (
                <InformationTip
                    className={classes.tip}
                    label={<Trans i18nKey="idea.details.form.networks.status.changeTo" values={{ networkName }} />}
                />
            ) : null}
        </div>
    )
}

export default IdeaNetworkStatusIndicator
