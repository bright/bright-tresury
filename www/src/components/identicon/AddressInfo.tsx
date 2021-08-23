import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { breakpoints } from '../../theme/theme'
import { Nil } from '../../util/types'
import Identicon from './Identicon'
import { formatAddress } from './utils'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        address: {
            marginLeft: '.5em',
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px',
            },
        },
    })
})

interface OwnProps {
    address: Nil<string>
    ellipsed?: boolean
}

export type AddressInfoProps = OwnProps

const AddressInfo = ({ address, ellipsed = true }: AddressInfoProps) => {
    const classes = useStyles()
    const { network } = useNetworks()

    const addressFragment = useMemo(() => formatAddress(address, network.ss58Format, ellipsed), [address])

    return (
        <div className={classes.root}>
            {address ? <Identicon address={address} /> : null}
            <div className={classes.address}>{addressFragment}</div>
        </div>
    )
}

export default AddressInfo
