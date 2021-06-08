import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {useAuth} from "../../../auth/AuthContext";
import Avatar from "../../../components/avatar/Avatar";
import Identicon from '../../../components/identicon/Identicon';
import TopBarButton from "../TopBarButton";
import clsx from "clsx";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '26px',
            lineHeight: '26px',
            width: '26px',
            borderRadius: '6px',
        },
        identicon: {
            backgroundColor: '#eeeeee',
        },
        avatar: {
            fontSize: '18px',
        }
    }),
);

const AccountImage = () => {
    const classes = useStyles()
    const {user} = useAuth()

    const address = user?.web3Addresses.find((address) => address.isPrimary)?.address ?? ''

    return (
        <TopBarButton>
            {user?.isEmailPassword ? <Avatar username={user.username} email={user.email} className={clsx(classes.root, classes.avatar)}/> :
                <div className={clsx(classes.root, classes.identicon)}>
                    <Identicon address={address} size={26}/>
                </div>}
        </TopBarButton>
    );
}

export default AccountImage
