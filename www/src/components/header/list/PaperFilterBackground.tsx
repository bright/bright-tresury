import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../../theme/theme";
import React from "react";
import {ClassNameProps} from "../../props/className.props";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'initial',
                flexGrow: 1,
                background: 'tomato',
                height: '32px',
                position: 'relative',
                backgroundColor: theme.palette.background.paper
            }
        },
    }))

export const PaperFilterBackground: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>
        {children}
    </div>
}
