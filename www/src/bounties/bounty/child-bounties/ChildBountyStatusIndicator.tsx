import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChildBountyStatus } from './child-bounties.dto'
import Status from '../../../components/status/Status'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: '6px',
        },
    }),
)

interface OwnProps {
    status: ChildBountyStatus
}

export type BountyStatusIndicatorProps = OwnProps

const ChildBountyStatusIndicator = ({ status }: BountyStatusIndicatorProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case ChildBountyStatus.Added:
                return 'Added'
            case ChildBountyStatus.CuratorProposed:
                return 'Curator Proposed'
            case ChildBountyStatus.Active:
                return 'Active'
            case ChildBountyStatus.PendingPayout:
                return 'Pending Payout'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case ChildBountyStatus.Added:
                return '#3091D8'
            case ChildBountyStatus.CuratorProposed:
                return '#F26763'
            case ChildBountyStatus.Active:
                return '#0E65F2'
            case ChildBountyStatus.PendingPayout:
                return '#01D55A'
        }
    }

    return (
        <div className={classes.root}>
            <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
        </div>
    )
}

export default ChildBountyStatusIndicator
