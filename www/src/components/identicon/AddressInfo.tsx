import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { breakpoints } from '../../theme/theme'
import { ellipseTextInTheMiddle } from '../../util/stringUtil'
import Identicon from './Identicon'

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
    address: string
}

export type AddressInfoProps = OwnProps

const AddressInfo = ({ address }: AddressInfoProps) => {
    const classes = useStyles()

    const addressFragment = useMemo(() => {
        if (!address) {
            return ''
        }
        return ellipseTextInTheMiddle(address, 12)
    }, [address])

    return (
        <div className={classes.root}>
            <Identicon address={address} />
            <div className={classes.address}>{addressFragment}</div>
        </div>
    )
}

export default AddressInfo
