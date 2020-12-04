import {
    IconButton as MaterialIconButton,
    IconButtonProps as MaterialIconButtonProps,
    SvgIcon
} from "@material-ui/core";
import React, {ElementType} from "react";

export type IconButtonProps = {
    svg?: ElementType
} & MaterialIconButtonProps

export const IconButton: React.FC<IconButtonProps> = ({children, svg, ...props}) => {
    return <MaterialIconButton {...props}>
        {svg ? <SvgIcon component={svg}/> : null}
    </MaterialIconButton>
}
