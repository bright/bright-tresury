import React from "react";
import {useTranslation} from "react-i18next";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingRight: '10px',
            whiteSpace: 'nowrap',
            color: theme.palette.text.disabled
        },
        ordinalNumber: {
            color: '#1B1D1C',
            fontSize: '16px',
            fontWeight: 700
        }
    })
)

interface Props {
    ordinalNumber: number
}

export const IdeaMilestoneOrdinalNumber = ({ ordinalNumber }: Props) => {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            {t('idea.milestones.list.card.ordinalNumber')}
            <span className={classes.ordinalNumber}>
                {ordinalNumber}
            </span>
        </div>
    )
}