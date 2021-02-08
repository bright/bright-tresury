import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../../theme/theme";
import React from "react";
import clsx from "clsx";
import {HeaderTabs} from "../HeaderTabs";
import {ClassNameProps} from "../../props/className.props";
import {mobileHeaderListHorizontalMargin} from "./HeaderListContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                height: 32,
                margin: 0,
                background: theme.palette.background.paper,
                paddingRight: mobileHeaderListHorizontalMargin
            }
        },
    }))

export const HeaderListTabs: React.FC<ClassNameProps> = ({className, children}) => {
    const classes = useStyles()
    return <HeaderTabs className={clsx(classes.root, className)}>
        {children}
    </HeaderTabs>
}
