import { isWidthDown, withWidth } from '@material-ui/core'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import PolkadotIdenticon from '@polkadot/react-identicon'
import React, { useMemo } from 'react'
import { breakpoints } from '../../theme/theme'

interface OwnProps {
    address: string
    size?: number
}

export type IdenticonProps = OwnProps & WithWidthProps

const IDENTICON_DESKTOP_SIZE = 32
const IDENTICON_MOBILE_SIZE = 42

const Identicon = ({ address, width, size: propsSize }: IdenticonProps) => {
    const size = useMemo(() => {
        if (propsSize !== undefined) {
            return propsSize
        }
        if (width === undefined) {
            return undefined
        }
        return isWidthDown(breakpoints.tablet, width) ? IDENTICON_MOBILE_SIZE : IDENTICON_DESKTOP_SIZE
    }, [width, propsSize])

    return <PolkadotIdenticon value={address} size={size} theme={'polkadot'} />
}

export default withWidth()(Identicon)
