import React from 'react'
import { AccountSelect, EMPTY_ACCOUNT } from '../../../components/select/AccountSelect'
import { Formik } from 'formik'
import { LoadingState, useLoading } from '../../../components/loading/LoadingWrapper'
import { handleAssociateWeb3Account } from '../../handleWeb3Sign'
import { Account, useAccounts } from '../../../substrate-lib/hooks/useAccounts'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Web3AddressRow } from './Web3AddressRow'
import { useAuth } from '../../AuthContext'
import { useTranslation } from 'react-i18next'
import { InfoBox } from '../../../components/form/InfoBox'
import { Label } from '../../../components/text/Label'
import { Web3LinkingButton } from './Web3LinkingButton'

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

const Web3AccountForm = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const accounts = useAccounts()
    const { user } = useAuth()

    const { call: associateCall, loadingState, error } = useLoading(handleAssociateWeb3Account)

    const onSubmit = async (values: { account: Account }) => {
        await associateCall(values.account)
    }

    const isFirstAddress = !user?.web3Addresses || user?.web3Addresses.length > 1

    return (
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
                        <InfoBox className={classes.error} message={t('account.web3.linkFailure')} level={'error'} />
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
    )
}

export default Web3AccountForm
