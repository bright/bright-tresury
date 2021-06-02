import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {InfoBox} from '../../../components/form/InfoBox'
import {AddressInfo} from '../../../components/identicon/AddressInfo'
import {Label} from '../../../components/text/Label'
import {useAuth, Web3Address} from '../../AuthContext'
import {Web3AddressRow} from './Web3AddressRow'
import {useMakePrimary, useUnlinkAddress} from "./web3Associate.api";
import {Web3LinkingButton} from './Web3LinkingButton'

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
    const {t} = useTranslation()
    const {user, refreshJwt} = useAuth()
    const classes = useStyles()

    const {mutateAsync: unlinkAddressMutateAsync, isLoading: unlinkAddressIsLoading, isError: unlinkAddressIsError} = useUnlinkAddress()
    const {mutateAsync: makePrimaryMutateAsync, isLoading: makePrimaryIsLoading, isError: makePrimaryIsError} = useMakePrimary()

    const onPrimaryChange = async (checked: boolean, address: Web3Address) => {
        if (!address.isPrimary && checked) {
            await makePrimaryMutateAsync(address.address, {
                onSuccess: refreshJwt
            })
        }
    }

    const onUnlinkCLick = async (address: string) => {
        await unlinkAddressMutateAsync(address, {
            onSuccess: refreshJwt
        })
    }

    return (
        <div>
            <Label className={classes.title} label={t('account.web3.web3Account')}/>
            {unlinkAddressIsError ? <InfoBox message={t('account.web3.unlinkFailure')} level={'error'}/> : null}
            {makePrimaryIsError ? <InfoBox message={t('account.web3.makePrimaryFailure')} level={'error'}/> : null}
            {user?.web3Addresses?.map((address) => {
                return (
                    <Web3AddressRow
                        key={address.address}
                        onPrimaryChange={(checked) => onPrimaryChange(checked, address)}
                        isPrimary={address.isPrimary}
                        addressComponent={<AddressInfo address={address.address}/>}
                        linkComponent={
                            <Web3LinkingButton
                                onClick={() => onUnlinkCLick(address.address)}
                                label={t('account.web3.unlink')}
                                disabled={unlinkAddressIsLoading || makePrimaryIsLoading}
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
