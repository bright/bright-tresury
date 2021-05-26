import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AddressInfo } from '../../../components/identicon/AddressInfo'
import {LoadingState, useLoading} from "../../../components/loading/useLoading";
import { Label } from '../../../components/text/Label'
import { useAuth, Web3Address } from '../../AuthContext'
import { Web3AddressRow } from './Web3AddressRow'
import { InfoBox } from '../../../components/form/InfoBox'
import { Web3LinkingButton } from './Web3LinkingButton'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        title: {
            marginBottom: '16px',
        },
        unlink: {
            color: theme.palette.warning.main,
        },
    })
})

const Web3AccountDetails = () => {
    const { t } = useTranslation()
    const { user, web3Unlink, web3MakePrimary } = useAuth()
    const classes = useStyles()
    const { call: unlinkCall, loadingState: unlinkAddressLoadingState, error: unlinkAddressError } = useLoading(
        web3Unlink,
    )
    const { call: makePrimaryCall, loadingState: makePrimaryLoadingState, error: makePrimaryError } = useLoading(
        web3MakePrimary,
    )

    const onPrimaryChange = (checked: boolean, address: Web3Address) => {
        if (!address.isPrimary && checked) {
            makePrimaryCall(address.address).then()
        }
    }

    return (
        <div>
            <Label className={classes.title} label={t('account.web3.web3Account')} />
            {unlinkAddressError && <InfoBox message={t('account.web3.unlinkFailure')} level={'error'} />}
            {makePrimaryError && <InfoBox message={t('account.web3.makePrimaryFailure')} level={'error'} />}
            {user?.web3Addresses?.map((address) => {
                return (
                    <Web3AddressRow
                        onPrimaryChange={(checked) => onPrimaryChange(checked, address)}
                        isPrimary={address.isPrimary}
                        addressComponent={<AddressInfo address={address.address} />}
                        linkComponent={
                            <Web3LinkingButton
                                onClick={() => unlinkCall(address.address)}
                                label={t('account.web3.unlink')}
                                disabled={
                                    unlinkAddressLoadingState === LoadingState.Loading ||
                                    makePrimaryLoadingState === LoadingState.Loading
                                }
                                className={classes.unlink}
                            />
                        }
                    />
                )
            })}
        </div>
    )
}

export default Web3AccountDetails
