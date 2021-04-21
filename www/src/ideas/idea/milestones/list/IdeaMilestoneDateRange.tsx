import React from "react";
import {Nil} from "../../../../util/types";
import {differenceInDays, format} from "date-fns";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";
import {IdeaMilestoneDateRangeDifference} from "./IdeaMilestoneDateRangeDifference";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
        gap: '10px',
        overflow: 'hidden'
    },
    dates: {
        whiteSpace: 'nowrap',
        fontWeight: 700,
    },
    separator: {
        color: theme.palette.text.disabled
    },
    difference: {
        color: theme.palette.text.disabled
    }
}))

interface Props {
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
}

export const IdeaMilestoneDateRange = ({ dateFrom, dateTo }: Props) => {

    const classes = useStyles()

    if (dateFrom && dateTo) {
        const difference = differenceInDays(new Date(dateTo), new Date(dateFrom)) + 1
        return (
            <div className={classes.root}>
                <span className={classes.dates}>
                    {format(new Date(dateFrom), 'dd-MM')} - {dateTo}
                </span>
                <span className={classes.separator}>|</span>
                <span className={classes.difference}>
                   <IdeaMilestoneDateRangeDifference differenceBetweenDatesInDays={difference} />
                </span>
            </div>
        )
    }

    if (dateFrom || dateTo) {
        return (
            <div className={classes.root}>
                <span className={classes.dates}>
                    {dateFrom ?? dateTo}
                </span>
                <span className={classes.separator}>|</span>
                <span className={classes.difference}>
                    <IdeaMilestoneDateRangeDifference differenceBetweenDatesInDays={1} />
                </span>
            </div>
        )
    }

    return null
}