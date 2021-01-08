import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {ButtonBase, createStyles} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '8px 18px !important',
            fontWeight: 400,
            fontSize: '16px',
            fontFamily: theme.typography.fontFamily,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '17px',
            },
            marginRight: '1em',
            color: theme.palette.text.primary,
            border: `solid 2px ${theme.palette.background.paper}`,
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'flex',
        },
        labelIcon: {
            marginRight: '10px'
        },
        selected: {
            border: `solid 2px ${theme.palette.primary.main}`,
        },
    }))

interface Props {
    label: string
    path: string
    svg?: string
}

export const TabLabel: React.FC<Props> = ({label, svg, path}) => {
    const classes = useStyles()

    return <ButtonBase centerRipple={true}>
        <NavLink
            className={classes.root}
            to={path}
            activeClassName={classes.selected}>
            {svg ? <img className={classes.labelIcon} src={svg}/> : null}
            {label}
        </NavLink>
    </ButtonBase>
}
