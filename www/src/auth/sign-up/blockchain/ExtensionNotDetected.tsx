import {useTranslation} from "react-i18next";
import {Button} from "../../../components/button/Button";
import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {SignUpComponentWrapper} from "../common/SignUpComponentWrapper";
import {ROUTE_SIGNUP_EMAIL} from "../../../routes";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            display: 'flex',
            justifyContent: 'center',
        },
        info: {
            whiteSpace: 'pre-line'
        },
        button: {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: 14
        }
    }
})

export const ExtensionNotDetected: React.FC = () => {
    const {t} = useTranslation()
    const history = useHistory()
    const classes = useStyles()

    return <div className={classes.root}>
        <SignUpComponentWrapper>
            <p className={classes.info}>{t('auth.signUp.blockchainSignUp.extensionNotDetected')}</p>
            <Button variant={'text'} className={classes.button} onClick={() => history.push(ROUTE_SIGNUP_EMAIL)}>
                {t('auth.signUp.blockchainSignUp.signUpWithEmail')}
            </Button>
        </SignUpComponentWrapper>
    </div>
}
