import React from "react";
import {useTranslation} from "react-i18next";
import SignUpForm from "../../sign-up/SignUpForm";
import {addEmailPassword} from "../account.api";

const EmailPasswordAccountForm = () => {
    const {t} = useTranslation()

    return <div>
        <SignUpForm submit={addEmailPassword} submitButtonLabel={t('account.emailPassword.addEmailCredentials')}/>
    </div>
}

export default EmailPasswordAccountForm
