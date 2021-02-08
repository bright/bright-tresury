import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../../theme/theme";
import React from "react";
import {ClassNameProps} from "../../props/className.props";
import clsx from "clsx";
import {headerListHorizontalMargin, mobileHeaderListHorizontalMargin} from "./HeaderListContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: '8px',
            alignSelf: 'center',
            height: '32px',
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                margin: `0 ${headerListHorizontalMargin}`,
                marginBottom: 16,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingLeft: mobileHeaderListHorizontalMargin
            },
        },
    }))

export const TimeSelectWrapper: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>
        {children}
    </div>
}
