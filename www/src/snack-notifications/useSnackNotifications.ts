import * as React from 'react'
import { SnackNotificationsContext } from './SnackNotificationsContext'

export function useSnackNotifications() {
    const context = React.useContext(SnackNotificationsContext)
    if (!context) {
        throw new Error('useSnackNotifications must be used within an SnackNotificationsContext')
    }

    return context
}
