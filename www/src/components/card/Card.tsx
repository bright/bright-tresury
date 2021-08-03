import { Paper, PaperProps } from '@material-ui/core'
import React, { PropsWithChildren } from 'react'
import { useCardStyles } from './cardStyles'

export type CardProps = PropsWithChildren<PaperProps>

const Card = ({ children, ...props }: CardProps) => {
    const classes = useCardStyles()

    return (
        <Paper {...props} className={classes.root}>
            <div className={classes.content}>{children}</div>
        </Paper>
    )
}
export default Card
