import React, { useEffect, useState } from 'react'
import { AccountSelect, EMPTY_ACCOUNT } from '../../../components/select/AccountSelect'
import { Formik } from 'formik'
import {LoadingState, useLoading} from "../../../components/loading/useLoading";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {useAccounts} from "../../../substrate-lib/accounts/useAccounts";
import {Account} from "../../../substrate-lib/accounts/AccountsContext";
import { Web3AddressRow } from './Web3AddressRow'
import { useAuth } from '../../AuthContext'
import { useTranslation } from 'react-i18next'
import { InfoBox } from '../../../components/form/InfoBox'
import { Label } from '../../../components/text/Label'
import { Web3LinkingButton } from './Web3LinkingButton'
import { EnterPasswordModal } from '../emailPassword/passwordModal/EnterPasswordModal'
import { useModal } from '../../../components/modal/useModal'

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

interface OwnProps {
    onSuccess: () => void
}

const Web3AccountForm = ({ onSuccess }: OwnProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const {accounts} = useAccounts()
    const { user, web3Associate } = useAuth()
    const passwordModal = useModal()
    const [selectedAccount, setSelectedAccount] = useState<Account>()

    const { call: associateCall, loadingState, error } = useLoading(web3Associate)

    const onConfirmPassword = async (password: string) => {
        try {
            await associateCall({ account: selectedAccount, password } as Web3AssociateValues)
        } finally {
            passwordModal.close()
        }
    }

    const onSubmit = async (values: { account: Account }) => {
        if (user?.isWeb3) {
            await associateCall({ account: values.account } as Web3AssociateValues)
        } else {
            setSelectedAccount(values.account)
            passwordModal.open()
        }
    }

    useEffect(() => {
        if (loadingState === LoadingState.Resolved) {
            onSuccess()
        }
    }, [loadingState])

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
                {({ values, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Label label={t('account.web3.associateWeb3Account')} />
                        {error && (
                            <InfoBox
                                className={classes.error}
                                message={t('account.web3.linkFailure')}
                                level={'error'}
                            />
                        )}
                        <Web3AddressRow
                            isPrimary={isFirstAddress}
                            primaryDisabled={true}
                            addressComponent={<AccountSelect showLabel={false} accounts={accounts} />}
                            linkComponent={
                                <Web3LinkingButton
                                    label={t('account.web3.link')}
                                    disabled={loadingState === LoadingState.Loading}
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
