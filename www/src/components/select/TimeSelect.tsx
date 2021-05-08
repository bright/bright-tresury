import {Select} from "./Select";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontWeight: 600,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
        }
    }))

export const TimeSelect: React.FC = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <Select
        className={classes.root}
        value={t('sign-components.timeSelect.currentSpendTime')}
        options={[t('sign-components.timeSelect.currentSpendTime')]}
    />
}
