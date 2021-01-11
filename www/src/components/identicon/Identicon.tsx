import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) => {
    const size = '32px'
    const tabletSize = '42px'
    return createStyles({
        identicon: {
            width: size,
            height: size,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: tabletSize,
                height: tabletSize
            },
            //TODO: remove once Identicon will be implemented
            backgroundColor: 'tomato',
            color: 'white',
            borderRadius: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
});

interface Props {
    account: string
}

export const Identicon: React.FC<Props> = ({account}) => {
    const classes = useStyles()
    return <div className={classes.identicon}>
        {/** TODO: implement Identicon
                https://github.com/polkadot-js/ui/tree/08132ef5663f677ed2b2a62112db76c1688c0b0e/packages/react-identicon
        */}
        {account.substring(0, 2)}
    </div>
}
