import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../../components/button/Button";
import {useAuth} from "../../AuthContext";
import DisabledFormField from "./components/DisabledFormField";

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            display: 'flex',
            flexDirection: 'column',
        },
        avatarContainer: {
            width: '46px',
            marginRight: '36px',
            marginTop: '44px',
        },
        spacing: {
            marginTop: '32px',
        },
    }),
);

const RegularUser = () => {
    const {t} = useTranslation()
    const classes = useStyles()
    const {user} = useAuth()

    return <div>
        {/* TODO: use data from payload*/}
        <DisabledFormField title={t('account.regularUser.username')} value={'username'}/>
        <DisabledFormField className={classes.spacing} title={t('account.regularUser.login')} value={'zumi_umi@gmail.com'}/>
        <Button className={classes.spacing} variant='text' color='primary'>{t('account.regularUser.resetPassword')}</Button>
    </div>
}

export default RegularUser
