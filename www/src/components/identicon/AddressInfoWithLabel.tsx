import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useNetworks } from '../../networks/useNetworks'
import Identicon from './Identicon'
import { formatAddress } from './utils'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        info: {
            display: 'flex',
            marginLeft: '.75em',
            flexDirection: 'row',
        },
        value: {
            fontSize: '1em',
            height: '1em',
            fontWeight: 600,
            marginTop: '24px',
            marginBottom: '4px',
        },
        label: {
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '24px',
            marginTop: '0',
            color: theme.palette.text.disabled,
        },
    })
})

interface OwnProps {
    address?: string
    label: string
}

export type AddressInfoWithLabelProps = OwnProps

const AddressInfoWithLabel = ({ address, label }: AddressInfoWithLabelProps) => {
    const classes = useStyles()
    const { network } = useNetworks()

    const addressFragment = useMemo(() => formatAddress(address, network.ss58Format), [address, network])

    return (
        <div className={classes.root}>
            {address && <Identicon address={address} />}
            <div className={classes.info}>
                <div>
                    <p className={classes.value}>{addressFragment}</p>
                    <p className={classes.label}>{label}</p>
                </div>
            </div>
        </div>
    )
}

export default AddressInfoWithLabel
