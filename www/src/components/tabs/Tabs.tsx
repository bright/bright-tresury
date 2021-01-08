import React from "react";
import {createStyles} from '@material-ui/core';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {TabLabel} from "./TabLabel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        }
    })
)

export interface TabEntry {
    label: string
    path: string
    svg?: string
}

interface Props {
    values: TabEntry[]
}

export const Tabs: React.FC<Props> = ({values}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {values ? values.map(({label, path, svg}) =>
            <TabLabel
                label={label}
                svg={svg}
                path={path}
            />
        ) : null}
    </div>
}
