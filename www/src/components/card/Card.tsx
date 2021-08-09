import { Paper, PaperProps } from '@material-ui/core'
import React, { PropsWithChildren } from 'react'
import { useCardStyles } from './cardStyles'
import clsx from 'clsx'

export type CardProps = PropsWithChildren<PaperProps>

const Card = ({ children, className, ...props }: CardProps) => {
    const classes = useCardStyles()

    return (
        <Paper {...props} className={clsx(classes.root, className)}>
            {children}
        </Paper>
    )
}
export default Card
