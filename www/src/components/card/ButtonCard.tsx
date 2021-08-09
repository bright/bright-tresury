import clsx from 'clsx'
import React from 'react'
import Card, { CardProps } from './Card'
import { useCardStyles } from './cardStyles'

interface OwnProps {}

export type ButtonCardProps = OwnProps & CardProps

const ButtonCard = ({ children, className, ...props }: ButtonCardProps) => {
    const classes = useCardStyles()

    return (
        <Card {...props} className={clsx(classes.transformOnHover, className)}>
            <div className={classes.content}>{children}</div>
        </Card>
    )
}

export default ButtonCard
