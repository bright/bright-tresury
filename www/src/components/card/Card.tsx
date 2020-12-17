import {Paper, PaperProps} from "@material-ui/core";
import React from "react";

export const Card: React.FC<PaperProps> = ({children, ...props}) => {
    return <Paper {...props}>
        {children}
    </Paper>
}
