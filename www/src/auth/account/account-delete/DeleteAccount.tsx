import React from 'react'
import Button from '../../../components/button/Button'
import DeleteAccountWarningModal from './DeleteAccountWarningModal'
import { useTranslation } from 'react-i18next'
import { AuthContextUser, useAuth } from '../../AuthContext'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../components/modal/useModal'
import { ROUTE_ACCOUNT_DELETED } from '../../../routes/routes'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import { useDeleteUser } from './unregister.api'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        deleteAccount: {
            margin: '0',
            width: '200px',
            fontWeight: 700,
            background: 'black',
            color: 'white',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
            },
        },
    }),
)

interface OwnProps {
    user: AuthContextUser
}

export type DeleteAccountProps = OwnProps

const DeleteAccount = ({ user }: DeleteAccountProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const history = useHistory()

    const { mutateAsync: deleteAccount } = useDeleteUser()

    const warningModal = useModal()

    const handleDeleteAccount = async () => {
        await deleteAccount(
            {},
            {
                onSuccess: async () => {
                    history.replace(ROUTE_ACCOUNT_DELETED)
                },
            },
        )
    }

    return (
        <>
            <Button className={classes.deleteAccount} variant="contained" onClick={warningModal.open}>
                {t('account.deleteAccount')}
            </Button>
            <DeleteAccountWarningModal
                open={warningModal.visible}
                onClose={warningModal.close}
                handleFormClose={handleDeleteAccount}
            />
        </>
    )
}

export default DeleteAccount
