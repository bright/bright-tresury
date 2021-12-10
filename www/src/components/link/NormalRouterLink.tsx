import { createStyles, Link as MaterialLink, LinkProps as MaterialLinkProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        link: {
            textDecoration: 'underline',
            color: 'inherit',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }),
)

interface OwnProps {}

export type RouterLinkProps = OwnProps & MaterialLinkProps & ReactRouterLinkProps

const NormalRouterLink = ({ children, className, ...props }: RouterLinkProps) => {
    const classes = useStyles()
    return (
        <MaterialLink component={ReactRouterLink} className={clsx(classes.link, className)} {...props}>
            {children}
        </MaterialLink>
    )
}

export default NormalRouterLink
