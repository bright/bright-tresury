import React from "react";
import {Divider as MaterialDivider, DividerProps} from '@material-ui/core';

export const Divider: React.FC<DividerProps> = ({children, ...props}) => {
    return <MaterialDivider {...props}/>
}
