import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React, {useMemo} from "react";
import {ellipseTextInTheMiddle} from "../../util/stringUtil";
import {Identicon} from "./Identicon";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            display: 'flex',
            alignItems: 'center'
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
            marginBottom: '4px'
        },
        label: {
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '24px',
            marginTop: '0',
            color: theme.palette.text.disabled
        },
    })
});

interface Props {
    label: string
    address?: string
}

export const AddressInfo: React.FC<Props> = ({address, label}) => {
    const classes = useStyles()

    const addressFragment = useMemo(() => {
        if (!address) return ''
        return ellipseTextInTheMiddle(address, 12)
    }, [address])

    return <div className={classes.root}>
        {address && <Identicon address={address}/>}
        <div className={classes.info}>
            <div>
                <p className={classes.value}>
                    {addressFragment}
                </p>
                <p className={classes.label}>{label}</p>
            </div>
        </div>
    </div>
}
