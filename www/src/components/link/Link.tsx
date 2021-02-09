import {Link as MaterialLink, LinkProps as MaterialLinkProps} from "@material-ui/core";
import React from "react";

export type LinkProps = MaterialLinkProps

export const Link: React.FC<LinkProps> = ({children, href, ...props}) => {
    return <MaterialLink
        color="inherit"
        {...props}
        href={href}
        target="_blank"
        rel="noopener">
        {children ?? href}
    </MaterialLink>
}
