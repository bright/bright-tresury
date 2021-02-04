import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import React from "react";
import {ClassNameProps} from "./className.props";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                overflowX: 'auto',
                paddingLeft: '1.5em'
            }
        },
    }))

export const ContentTypeTabs: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>
        {children}
    </div>
}
