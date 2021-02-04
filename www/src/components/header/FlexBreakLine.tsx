import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {ClassNameProps} from "./className.props";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexBasis: '100%',
            height: 0,
        }
    }))

export const FlexBreakLine: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>
        {children}
    </div>
}
