import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfoBox from '../../../components/form/InfoBox'
import { useModal } from '../../../components/modal/useModal'
import AccountSelect, { EMPTY_ACCOUNT } from '../../../components/select/AccountSelect'
import { Label } from '../../../components/text/Label'
import { Account } from '../../../substrate-lib/accounts/AccountsContext'
import { useAuth, UserStatus } from '../../AuthContext'
import EnterPasswordModal from '../emailPassword/passwordModal/EnterPasswordModal'
import Web3AddressRow from './Web3AddressRow'
import { useAssociateWeb3Account } from './web3Associate.api'
import Web3LinkingButton from './Web3LinkingButton'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        link: {
            color: theme.palette.primary.main,
        },
        error: {
            marginBottom: 16,
        },
    })
})

export interface Web3AssociateValues {
    account: Account
    password?: string
}

export interface Web3AccountFormProps {
    onSuccess: () => void
}

const Web3AccountForm = ({ onSuccess }: Web3AccountFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { user, refreshSession } = useAuth()
    const passwordModal = useModal()
    const [selectedAccount, setSelectedAccount] = useState<Account>()

    const { mutateAsync, isLoading, isError } = useAssociateWeb3Account()

    const onAssociateSuccess = () => {
        refreshSession()
        onSuccess()
    }

    const onConfirmPassword = async (password: string) => {
        try {
            await mutateAsync({ account: selectedAccount, password } as Web3AssociateValues, {
                onSuccess: onAssociateSuccess,
            })
        } finally {
            passwordModal.close()
        }
    }

    const onSubmit = async (values: { account: Account }) => {
        if (user?.status === UserStatus.Web3Only) {
            await mutateAsync({ account: values.account } as Web3AssociateValues, {
                onSuccess: onAssociateSuccess,
            })
        } else {
            setSelectedAccount(values.account)
            passwordModal.open()
        }
    }

    const isFirstAddress = !user?.web3Addresses || user?.web3Addresses.length > 1

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    account: EMPTY_ACCOUNT,
                }}
                onSubmit={onSubmit}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Label label={t('account.web3.associateWeb3Account')} />
                        {isError ? (
                            <InfoBox
                                className={classes.error}
                                message={t('account.web3.linkFailure')}
                                level={'error'}
                            />
                        ) : null}
                        <Web3AddressRow
                            isPrimary={isFirstAddress}
                            primaryDisabled={true}
                            addressComponent={<AccountSelect showLabel={false} />}
                            linkComponent={
                                <Web3LinkingButton
                                    label={t('account.web3.link')}
                                    disabled={isLoading}
                                    className={classes.link}
                                    type="submit"
                                />
                            }
                        />
                    </form>
                )}
            </Formik>
            <EnterPasswordModal
                open={passwordModal.visible}
                onClose={passwordModal.close}
                onConfirm={onConfirmPassword}
            />
        </>
    )
}

export default Web3AccountForm
