import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {IconButton} from "../button/IconButton";
import crossSvg from "../../assets/cross.svg";
import {ClassNameProps} from "../props/className.props";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignSelf: 'self-start',
            padding: '0 0 2em 2em',
        },
    }))

interface Props {
    onClose: () => void
}

export const CloseIcon: React.FC<Props & ClassNameProps> = ({onClose, className = ''}) => {
    const classes = useStyles()

    return <IconButton className={clsx(classes.root, className)} svg={crossSvg} onClick={onClose}/>
}
