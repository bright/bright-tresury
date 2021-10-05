import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import notificationsNone from '../../../assets/notification_none.svg'
import notificationsNew from '../../../assets/notifications_new.svg'
import notificationsOpenNone from '../../../assets/notifications_open.svg'
import notificationsOpenNew from '../../../assets/notification_open_new.svg'
import IconButton from '../../../components/button/IconButton'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '20px',
            width: '20px',
        },
    }),
)

interface OwnProps {
    isOpen: boolean
    hasUnreadNotifications: boolean
    onClick: () => void
}

export type NotificationsButtonProps = OwnProps

const NotificationsButton = ({ isOpen, onClick, hasUnreadNotifications }: NotificationsButtonProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const svg = useMemo(() => {
        if (isOpen) return hasUnreadNotifications ? notificationsOpenNew : notificationsOpenNone
        return hasUnreadNotifications ? notificationsNew : notificationsNone
    }, [isOpen, hasUnreadNotifications])

    return (
        <IconButton
            className={classes.root}
            onClick={onClick}
            alt={t('topBar.notifications.notifications')}
            svg={svg}
        />
    )
}

export default NotificationsButton
