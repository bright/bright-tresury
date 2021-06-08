import {isWidthDown, withWidth} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import React, {useMemo} from "react";
import {breakpoints} from "../../theme/theme";
import PolkadotIdenticon from '@polkadot/react-identicon';

const useStyles = makeStyles((theme: Theme) => {
    const size = '32px'
    const tabletSize = '42px'
    return createStyles({
        identicon: {
            width: size,
            height: size,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: tabletSize,
                height: tabletSize,
            },
        },
    })
})

interface OwnProps {
    address: string
}

export type IdenticonProps = OwnProps & WithWidthProps

const IDENTICON_DESKTOP_SIZE = 32
const IDENTICON_MOBILE_SIZE = 42

const Identicon = ({ address , width}: IdenticonProps) => {
    const size = useMemo(
        () => width && isWidthDown(breakpoints.tablet, width) ? IDENTICON_MOBILE_SIZE : IDENTICON_DESKTOP_SIZE,
        [width]
    )
    const classes = useStyles()
    return (
        <div className={classes.identicon}>
            <PolkadotIdenticon
            value={address}
            size={size}
            theme={'polkadot'}
        />
        </div>
    )
}

export default withWidth()(Identicon)
