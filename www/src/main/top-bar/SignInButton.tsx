import React from 'react';
import {useTranslation} from "react-i18next";
import signInSrc from '../../assets/lock.svg'
import {ROUTE_SIGNIN} from "../../routes/routes";
import TopBarButton from "./TopBarButton";
import { useHistory } from 'react-router-dom';

const SignInButton = () => {
    const {t} = useTranslation()
    const history = useHistory()

    const onClick = () => history.push(ROUTE_SIGNIN)

    return <TopBarButton alt={t('topBar.signIn')} svg={signInSrc} onClick={onClick}/>
}

export default SignInButton
