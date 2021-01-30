import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {IconButton} from "../button/IconButton";
import crossSvg from "../../assets/cross.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            top: 32,
            right: 32,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                top: 20,
                right: 16
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                top: 70,
                right: 8,
            }
        },
    }))

interface Props {
    onClose: () => void
}

export const CloseIcon: React.FC<Props> = ({onClose}) => {
    const classes = useStyles()

    return <IconButton className={classes.root} svg={crossSvg} onClick={onClose}/>
}
