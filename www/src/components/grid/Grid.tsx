import React from "react";
import {Grid as MaterialGrid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {GridItem} from "./GridItem";

const horizontalMargin = '32px'
const mobileHorizontalMargin = '18px'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            padding: `26px ${horizontalMargin}`,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: `8px ${mobileHorizontalMargin} 26px ${mobileHorizontalMargin}`,
            },
        },
    })
})

interface GridProps<T> {
    items: T[]
    component: (item: T) => JSX.Element
}

export type IGrid<T = any> = React.FC<GridProps<T>>

export const Grid: IGrid = ({items, component}) => {
    const classes = useStyles()

    return <MaterialGrid container spacing={2} className={classes.root}>
        {items.map((item, index: number) =>
            <GridItem key={index}>
                {component(item)}
            </GridItem>
        )}
    </MaterialGrid>
}
