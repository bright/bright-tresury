import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Switch from '../../components/switch/Switch'
import { Label } from '../../components/text/Label'
import { useGetUserSettings, usePatchUserSettings } from './user-settings.api'

const useStyles = makeStyles(() =>
    createStyles({
        switch: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontWeight: 'normal',
            fontSize: '18px',
            marginTop: '8px',
            marginBottom: '0',
        },
    }),
)

interface OwnProps {
    userId: string
}

export type AccountSettingsProps = OwnProps

const AccountSettings = ({ userId }: AccountSettingsProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { data, refetch } = useGetUserSettings({ userId })
    const { mutateAsync } = usePatchUserSettings()

    const onSwitchChange = async () => {
        const isEmailNotificationEnabled = !data?.isEmailNotificationEnabled
        await mutateAsync(
            { userId, dto: { isEmailNotificationEnabled } },
            {
                onSuccess: async () => {
                    await refetch()
                },
            },
        )
    }

    return (
        <div>
            <Label label={t('account.notifications.title')} />
            {data ? (
                <div className={classes.switch}>
                    <p>{t('account.notifications.switchTitle')}</p>
                    <Switch checked={data.isEmailNotificationEnabled} onChange={onSwitchChange} />
                </div>
            ) : null}
        </div>
    )
}

export default AccountSettings
