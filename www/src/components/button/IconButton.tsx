import {IconButton as MaterialIconButton, IconButtonProps as MaterialIconButtonProps} from "@material-ui/core";
import React from "react";

interface OwnProps {
    svg?: string
}

export type IconButtonProps = OwnProps & MaterialIconButtonProps

export const IconButton: React.FC<IconButtonProps> = ({children, svg, ...props}) => {
    return <MaterialIconButton {...props}>
        {svg ? <img src={svg} alt={''}/> : null}
    </MaterialIconButton>
}
