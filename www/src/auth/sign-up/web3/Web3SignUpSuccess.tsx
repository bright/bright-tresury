import React from "react";
import SignUpSuccess from "../common/SignUpSucces";
import {useTranslation} from "react-i18next";

export const Web3SignUpSuccess: React.FC = () => {
    const {t} = useTranslation()
    return <SignUpSuccess subtitle={t('auth.signUp.web3SignUp.successSubtitle')}/>
}
