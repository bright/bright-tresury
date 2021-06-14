import React, { PropsWithChildren } from 'react'
import { Paper, PaperProps } from '@material-ui/core'
import { useCardStyles } from './cardStyles'
import { Link } from 'react-router-dom'

interface OwnProps {
    redirectTo: string
}

export type LinkCardProps = PropsWithChildren<OwnProps & PaperProps>

const LinkCard = ({ redirectTo, children, ...props }: LinkCardProps) => {
    const classes = useCardStyles()

    return (
        <Paper {...props} className={classes.root}>
            <Link to={redirectTo} className={classes.link}>
                {children}
            </Link>
        </Paper>
    )
}

export default LinkCard
