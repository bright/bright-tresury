import {Radio as MaterialRadio, RadioProps as MaterialRadioProps} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import emptyIcon from "../../assets/radio_empty.svg";
import checkedIcon from "../../assets/radio_checked.svg";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '17px',
            height: '17px',
        },
    }),
)

export type RadioProps = MaterialRadioProps

export const Radio = ({ ...props }: RadioProps) => {
    const {t} = useTranslation()
    const classes = useStyles()
    return (
        <MaterialRadio
            classes={classes}
            {...props}
            icon={<img src={emptyIcon} alt={t('components.radioBox.empty')}/>}
            checkedIcon={<img src={checkedIcon} alt={t('components.radioBox.checked')}/>}
        />
    )
}
