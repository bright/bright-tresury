import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        labelWrapper: {
            display: 'flex',
        },
        labelIcon: {
            marginRight: '10px'
        },
        link: {
            textDecoration: 'none',
            color: theme.palette.text.primary
        }
    }))

interface Props {
    label: string
    svg?: string
    path?: string
}

export const TabLabel: React.FC<Props> = ({label, svg, path}) => {
    const classes = useStyles()
    const iconLabel = <div className={classes.labelWrapper}>
        {svg ? <img className={classes.labelIcon} src={svg}/> : null}
        {label}
    </div>
    return <>
        {path ? <Link className={classes.link} to={path}>{iconLabel}</Link> : iconLabel}
    </>
}
