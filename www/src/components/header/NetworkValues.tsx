import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import React from "react";
import {ClassNameProps} from "./className.props";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignSelf: 'flex-start',
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
                marginTop: '16px',
                justifyContent: 'center',
                width: '100%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                paddingLeft: '1.5em',
                paddingRight: '1.5em'
            }
        },
    }))

export const NetworkValues: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>
        {children}
    </div>
}
