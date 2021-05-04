import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import Avatar from "../../components/avatar/Avatar";
import Container from "../../components/form/Container";
import {breakpoints} from "../../theme/theme";
import EmailPasswordAccount from "./emailPassword/EmailPasswordAccount";
import Web3Account from "./web3/Web3Account";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            marginTop: '21px',
        },
        avatarContainer: {
            width: '46px',
            marginRight: '36px',
            marginTop: '44px',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        spacer: {
            height: '2px',
            backgroundColor: theme.palette.background.default,
            width: '100%',
            marginTop: '32px',
            marginBottom: '32px',
        },
        halfWidth: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
            },
        },
        wide: {
            width: '75%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        }
    }),
);

const Account = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    return <Container title={t('account.title')}>
        <div className={classes.root}>
            <div className={classes.avatarContainer}>
                <Avatar/>
            </div>
            <div className={classes.content}>
                <div className={classes.halfWidth}>
                    <EmailPasswordAccount/>
                </div>
                <div className={clsx(classes.spacer, classes.halfWidth)}/>
                <div className={classes.wide}>
                    <Web3Account/>
                </div>
                <div className={clsx(classes.spacer, classes.halfWidth)}/>
            </div>
        </div>
    </Container>
}

export default Account
