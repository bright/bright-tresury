import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import errorSvg from "../../../../assets/error.svg";
import {Button} from "../../../../components/button/Button";
import {LoadingState} from "../../../../components/loading/LoadingWrapper";
import {sendVerifyEmail} from "../../../auth.api";
import {useSuperTokensRequest} from "../../../supertokens.utils/useSuperTokensRequest";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
        },
        verifyError: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.warning.main,
            marginRight: '14px',
        },
        errorIcon: {
            width: '20px',
            height: '20px',
            marginRight: '8px',
        }
    }),
);

const EmailNotVerifiedError = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    const {call: sendVerifyEmailCall, loadingState} = useSuperTokensRequest(sendVerifyEmail)

    const onSendVerifyEmailButtonClick = () => {
        sendVerifyEmailCall({})
    }

    const renderButton = () => {
        switch (loadingState) {
            case LoadingState.Initial:
            case LoadingState.Loading:
                return <Button disabled={loadingState === LoadingState.Loading} variant='text' color='primary' onClick={onSendVerifyEmailButtonClick}>
                    {t('account.emailPassword.resendEmail')}
                </Button>
            case LoadingState.Error:
                return <p>{t('account.emailPassword.emailSendingError')}</p>
            case LoadingState.Resolved:
                return <p>{t('account.emailPassword.emailResent')}</p>
        }
    }

    return <div className={classes.root}>
        <div className={classes.verifyError}>
            <img className={classes.errorIcon} src={errorSvg} alt={t('account.emailPassword.emailVerificationNeeded')}/>
            <p>{t('account.emailPassword.emailVerificationNeeded')}</p>
        </div>
        {renderButton()}
    </div>
}

export default EmailNotVerifiedError
