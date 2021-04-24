import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import Container from "../../components/form/Container";
import EmailSignUp from "./email/EmailSignUp";
import {ToggleButton} from "../../components/toggle/ToggleButton";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import BlockchainSignUp from "./blockchain/BlockchainSignUp";
import {ToggleEntry} from "../../components/toggle/SingleToggleButton";
import {Location} from "history";
import {SignUpComponentWrapper} from "./common/SignUpComponentWrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toggleContainer: {
            display: 'flex',
            justifyContent: 'center'
        },
        toggle: {
            width: '100%',
        }
    }),
);

enum SignUpOption { Email = 'email', Blockchain = 'blockchain'}

const DefaultSignUpOption = SignUpOption.Email

const SignUp: React.FC = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    let {path} = useRouteMatch();

    const getTranslation = (option: SignUpOption): string => {
        switch (option) {
            case SignUpOption.Email:
                return t('auth.signUp.emailSignUpLabel')
            case SignUpOption.Blockchain:
                return t('auth.signUp.blockchainSignUpLabel')
        }
    }


    const signUpOptions = Object.values(SignUpOption)

    const toggleEntries = signUpOptions.map((option: SignUpOption) => {
        return {
            label: getTranslation(option),
            path: `${path}/${option}`
        } as ToggleEntry
    })

    const isActiveToggle = (entry: ToggleEntry, location: Location) => {
        const isEntryPath = entry.path === location.pathname
        if (isEntryPath) {
            return true
        } else {
            const isAnyEntryPath = toggleEntries.find((entry) => entry.path === location.pathname)
            return isAnyEntryPath ? false : entry.label === getTranslation(DefaultSignUpOption)
        }
    }

    return <Container title={t('auth.signUp.title')}>
        <div className={classes.toggleContainer}>
            <SignUpComponentWrapper>
                <ToggleButton
                    className={classes.toggle}
                    toggleEntries={toggleEntries}
                    isActive={isActiveToggle}
                />
            </SignUpComponentWrapper>
        </div>
        <Switch>
            <Route exact={true} path={path}>
                <EmailSignUp/>
            </Route>
            <Route exact={true} path={`${path}/${SignUpOption.Email}`}>
                <EmailSignUp/>
            </Route>
            <Route exact={true} path={`${path}/${SignUpOption.Blockchain}`}>
                <BlockchainSignUp/>
            </Route>
        </Switch>
    </Container>
}

export default SignUp
