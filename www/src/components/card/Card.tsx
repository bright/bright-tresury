import React, { PropsWithChildren } from 'react'
import { Paper, PaperProps } from '@material-ui/core'
import { useCardStyles } from './cardStyles'

export type CardProps = PropsWithChildren<PaperProps>

const Card = ({ children, ...props }: CardProps) => {
    const classes = useCardStyles()

    return (
        <Paper {...props} className={classes.root}>
            {children}
        </Paper>
    )
}
export default Card
