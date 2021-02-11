import {createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import crossIcon from "../../../../assets/validation_rules_cross.svg";
import tickIcon from "../../../../assets/validation_rules_tick.svg";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '1em',
        },
        icon: {
            margin: '0 7px',
            height: '6px',
        },
        label: {
            fontSize: '12px',
            margin: 0
        },
        labelActive: {
            fontWeight: 'bold',
        },
        labelInactive: {
            color: '#7B7B7B',
        }
    }),
);

export interface ValidationRuleLabelProps {
    message: string
    isError: boolean
}

export const ValidationRuleLabel: React.FC<ValidationRuleLabelProps> = ({message, isError}) => {
    const classes = useStyles()
    const iconSrc = isError ? crossIcon : tickIcon
    const labelClass = isError ? classes.labelInactive : classes.labelActive
    return <div className={classes.root}>
        <img src={iconSrc} className={classes.icon}/>
        <p className={`${classes.label} ${labelClass}`}>{message}</p>
    </div>
}
