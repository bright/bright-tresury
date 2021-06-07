import { createStyles, Link as MaterialLink } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, {PropsWithChildren} from 'react'
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

interface OwnProps {
    to: string
    replace?: boolean
}

export type RouterLinkProps = PropsWithChildren<OwnProps>

const RouterLink = ({ to, replace, children }: RouterLinkProps) => {
    const classes = useStyles()
    return (
        <MaterialLink component={ReactRouterLink} to={to} replace={replace} className={classes.link}>
            <Strong>{children}</Strong>
        </MaterialLink>
    )
}

export default RouterLink
