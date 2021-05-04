import {Radio as MaterialRadio, RadioProps as MaterialRadioProps} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import emptyIcon from "../../assets/checkbox_empty.svg";
import checkedIcon from "../../assets/checkbox_checked.svg";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '17px',
            height: '17px',
        },
    }))

export type RadioProps = MaterialRadioProps

export const Radio = ({...props}: RadioProps) => {
    const classes = useStyles()
    return <MaterialRadio
        classes={classes}
        {...props}
        icon={<img src={emptyIcon}/>}
        checkedIcon={<img src={checkedIcon}/>}
    />
}
