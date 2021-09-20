import React, { Children, PropsWithChildren } from 'react'
import { Grid as MaterialGrid, GridProps as MaterialGridProps } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import GridItem from './GridItem'

const DEFAULT_HORIZONTAL_PADDING = '32px'
const DEFAULT_MOBILE_HORIZONTAL_PADDING = '18px'

interface StylesProps {
    horizontalPadding: string
    mobileHorizontalPadding: string
}

const useStyles = makeStyles<Theme, StylesProps>((theme) => {
    return createStyles({
        root: {
            padding: (props) => `26px ${props.horizontalPadding}`,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: (props) => `18px ${props.mobileHorizontalPadding} 26px ${props.mobileHorizontalPadding}`,
            },
        },
    })
})

interface OwnProps<T> {
    items?: T[]
    renderItem?: (item: T, index: number) => JSX.Element
    horizontalPadding?: string
    mobileHorizontalPadding?: string
}

export type GridProps<T = any> = PropsWithChildren<OwnProps<T>> & MaterialGridProps

const Grid = ({
    items,
    renderItem,
    horizontalPadding = DEFAULT_HORIZONTAL_PADDING,
    mobileHorizontalPadding = DEFAULT_MOBILE_HORIZONTAL_PADDING,
    xs,
    md,
    children,
    ...props
}: GridProps) => {
    const classes = useStyles({
        horizontalPadding,
        mobileHorizontalPadding,
    })
    return (
        <MaterialGrid container spacing={2} className={classes.root}>
            {children
                ? Children.map(Children.toArray(children), (child, index) => (
                      <GridItem key={index} xs={xs || 12} md={md || 6} {...props}>
                          {child}
                      </GridItem>
                  ))
                : null}
            {items?.map((item, index: number) => (
                <GridItem key={index} xs={xs || 12} md={md || 6} {...props}>
                    {renderItem ? renderItem(item, index) : null}
                </GridItem>
            ))}
        </MaterialGrid>
    )
}
export default Grid
