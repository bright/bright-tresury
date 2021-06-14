import React from 'react'
import { Grid as MaterialGrid } from '@material-ui/core'
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
    items: T[]
    renderItem: (item: T) => JSX.Element
    horizontalPadding?: string
    mobileHorizontalPadding?: string
}

export type GridProps<T = any> = React.FC<OwnProps<T>>

const Grid: GridProps = ({
    items,
    renderItem,
    horizontalPadding = DEFAULT_HORIZONTAL_PADDING,
    mobileHorizontalPadding = DEFAULT_MOBILE_HORIZONTAL_PADDING,
}) => {
    const classes = useStyles({
        horizontalPadding,
        mobileHorizontalPadding,
    })

    return (
        <MaterialGrid container spacing={2} className={classes.root}>
            {items.map((item, index: number) => (
                <GridItem key={index}>{renderItem(item)}</GridItem>
            ))}
        </MaterialGrid>
    )
}
export default Grid
