import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@material-ui/core'
import React from 'react'

interface OwnProps {}
export type LinkProps = OwnProps & MaterialLinkProps
const Link = ({ children, href, ...props }: LinkProps) => {
    return (
        <MaterialLink color="inherit" {...props} href={href}>
            {children ?? href}
        </MaterialLink>
    )
}
export default Link
