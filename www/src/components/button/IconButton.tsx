import {IconButton as MaterialIconButton, IconButtonProps as MaterialIconButtonProps} from "@material-ui/core";
import React from "react";

export type IconButtonProps = {
    svg?: string
} & MaterialIconButtonProps

export const IconButton: React.FC<IconButtonProps> = ({children, svg, ...props}) => {
    return <MaterialIconButton {...props}>
        {svg ? <img src={svg}/> : null}
    </MaterialIconButton>
}
