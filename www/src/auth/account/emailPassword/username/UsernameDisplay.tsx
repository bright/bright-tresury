import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditButton from '../../../../components/header/details/EditButton'
import { ClassNameProps } from '../../../../components/props/className.props'
import DisabledFormField from '../components/DisabledFormField'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'flex-end',
        },
        disabled: {
            marginTop: '2em',
        },
        button: {
            marginBottom: '-7px',
            marginLeft: '24px',
        },
    }),
)

interface OwnProps {
    username: string
    onEditClick: () => void
}

type UsernameDisplayProps = OwnProps & ClassNameProps

const UsernameDisplay = ({ username, onEditClick }: UsernameDisplayProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <DisabledFormField
                title={t('account.emailPassword.username')}
                value={username}
                className={classes.disabled}
            />
            <EditButton
                className={classes.button}
                label={t('account.emailPassword.editUsername')}
                onClick={onEditClick}
            />
        </div>
    )
}

export default UsernameDisplay
