import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../../components/button/Button";
import {AddressInfo} from "../../../components/identicon/AddressInfo";
import {Link} from "../../../components/link/Link";
import {Radio} from "../../../components/radio/Radio";
import {Label} from "../../../components/text/Label";
import {useAuth} from "../../AuthContext";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        title: {
            marginBottom: '32px',
        },
        web3Element: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '50px',
            width: '100%',
        },
        delete: {
            fontWeight: 'bold',
            color: theme.palette.warning.main
        },
        primary: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        radio: {
            marginRight: '8px',
        },
        disabledPrimary: {
            color: theme.palette.text.disabled
        }
    })
});

const Web3AccountDetails = () => {
    const {t} = useTranslation()
    const {user} = useAuth()
    const classes = useStyles()

    return <div>
        <Label className={classes.title} label={t('account.web3.web3Account')}/>
        {user?.web3Addresses.map((address) => {
            return <div className={classes.web3Element}>
                <AddressInfo address={address.address}/>
                <Link className={classes.delete}>{t('account.web3.unlink')}</Link>
                <div className={classes.primary}>
                    <Radio className={classes.radio} checked={address.isPrimary}/>
                    <p className={address.isPrimary ? '' : classes.disabledPrimary}>{t('account.web3.primary')}</p>
                </div>
            </div>
        })}
        {/* TODO: add button behaviour*/}
        <Button variant='text' color='primary'>{t('account.web3.add')}</Button>
    </div>
}

export default Web3AccountDetails
