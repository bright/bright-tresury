import { createStyles, Link as MaterialLink } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Strong } from '../info/Info'

const useStyles = makeStyles(() =>
    createStyles({
        link: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }),
)

export interface RouterLinkProps {
    to: string
}

export const RouterLink: React.FC<RouterLinkProps> = ({ to, children }) => {
    const classes = useStyles()
    return (
        <MaterialLink component={ReactRouterLink} to={to} className={classes.link}>
            <Strong>{children}</Strong>
        </MaterialLink>
    )
}
