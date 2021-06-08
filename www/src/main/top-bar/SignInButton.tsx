import React from 'react'
import { useTranslation } from 'react-i18next'
import signInSrc from '../../assets/lock.svg'
import {IconButton} from "../../components/button/IconButton";
import { ROUTE_SIGNIN } from '../../routes/routes'
import TopBarButton from './TopBarButton'
import {useHistory} from 'react-router-dom'

const SignInButton = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const onClick = () => history.push(ROUTE_SIGNIN)

    return <TopBarButton>
        <IconButton onClick={onClick} alt={t('topBar.signIn')} svg={signInSrc}/>
    </TopBarButton>
}

export default SignInButton
