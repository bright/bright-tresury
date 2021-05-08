import {Trans} from "react-i18next";
import {RouterLink} from "../../../components/link/RouterLink";
import {ROUTE_SIGNUP} from "../../../routes/routes";
import {Typography} from "@material-ui/core";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        signUpLabel: {
            textAlign: 'center',
            fontSize: '14px',
            marginTop: '3em',
        },
    }),
);

export const SignUpLabel: React.FC = () => {
    const classes = useStyles()

    return <Typography className={classes.signUpLabel}>
        {<Trans id='privacy-notice'
                i18nKey='auth.signIn.signUpLabel'
                components={{a: <RouterLink to={ROUTE_SIGNUP}/>}}/>}
    </Typography>
}
