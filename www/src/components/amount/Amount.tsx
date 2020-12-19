import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";
import {formatNumber} from "../../util/numberUtil";

const useStyles = makeStyles((theme: Theme) => createStyles({
        root: {
            backgroundColor: theme.palette.primary.light,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            alignContent: 'flex-start',
            borderRadius: '8px',
            padding: '0 16px',
        },
        amount: {
            fontSize: '18px',
            fontWeight: 700
        },
        label: {
            fontSize: '14px',
            paddingTop: 0
        }
    }),
);

interface AmountProps {
    amount: number
    currency?: string
    label?: string
}

export const Amount: React.FC<AmountProps> = ({amount, currency, label, ...props}) => {
    const classes = useStyles()
    return <div {...props} className={classes.root}>
        <p className={classes.amount}>{formatNumber(amount)} {currency}</p>
        {label && <p className={classes.label}>{label}</p>}
    </div>
}
