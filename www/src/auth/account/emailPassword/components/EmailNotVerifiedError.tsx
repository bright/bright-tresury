import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import { LoadingState } from '../../../../components/loading/useLoading'
import {breakpoints} from "../../../../theme/theme";
import {sendVerifyEmail} from "../../../auth.api";
import {useSuperTokensRequest} from "../../../supertokens.utils/useSuperTokensRequest";
import VerifyErrorLabel from "./VerifyErrorLabel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
                flexWrap: 'wrap',
            },
            justifyContent: 'space-between',
        },
    }),
)

const EmailNotVerifiedError = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { call: sendVerifyEmailCall, loadingState } = useSuperTokensRequest(sendVerifyEmail)

    const onSendVerifyEmailButtonClick = async () => {
        await sendVerifyEmailCall({})
    }

    const renderButton = () => {
        switch (loadingState) {
            case LoadingState.Initial:
                return (
                    <Button variant="text" color="primary" onClick={onSendVerifyEmailButtonClick}>
                        {t('account.emailPassword.resendEmail')}
                    </Button>
                )
            case LoadingState.Loading:
                return (
                    <Button disabled={true} variant="text" color="primary" onClick={onSendVerifyEmailButtonClick}>
                        {t('account.emailPassword.resendEmail')}
                    </Button>
                )
            case LoadingState.Error:
                return <p>{t('account.emailPassword.emailSendingError')}</p>
            case LoadingState.Resolved:
                return <p>{t('account.emailPassword.emailResent')}</p>
        }
    }

    return (
        <div className={classes.root}>
            <VerifyErrorLabel />
            {renderButton()}
        </div>
    )
}

export default EmailNotVerifiedError
