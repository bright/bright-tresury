import {Trans} from "react-i18next";
import {RouterLink} from "../../../components/link/RouterLink";
import {Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ROUTE_SIGNIN_EMAIL, ROUTE_SIGNIN_WEB3} from "../../../routes/routes";
import {SignOption} from "../../sign-components/SignOption";

const useStyles = makeStyles(() => {
    return {
        login: {
            textAlign: 'center',
            fontSize: '14px',
        }
    }
})

interface OwnProps {
    signOption: SignOption
}

export const AlreadySignedUp: React.FC<OwnProps> = ({signOption}) => {
    const classes = useStyles()

    const getRoute = () => {
        switch (signOption) {
            case SignOption.Email:
                return ROUTE_SIGNIN_EMAIL
            case SignOption.Web3:
                return ROUTE_SIGNIN_WEB3
        }
    }

    return <Typography className={classes.login}>
        {<Trans id='privacy-notice'
                i18nKey="auth.signUp.logInLabel"
                components={{a: <RouterLink to={getRoute()}/>}}/>}
    </Typography>
}
