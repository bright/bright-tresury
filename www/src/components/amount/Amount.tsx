import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";
import {formatNumber} from "../../util/numberUtil";

const useStyles = makeStyles((theme: Theme) => createStyles({
        root: {
            backgroundColor: theme.palette.primary.light,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '16px 20px',
        },
        amount: {
            fontSize: '18px',
            fontWeight: 700
        },
        label: {
            fontSize: '14px',
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
        <div className={classes.amount}>{formatNumber(amount)} {currency}</div>
        {label && <div className={classes.label}>{label}</div>}
    </div>
}
