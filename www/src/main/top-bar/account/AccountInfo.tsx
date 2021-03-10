import {Divider} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {useTranslation} from "react-i18next";
import info from "../../../assets/info.svg";
import TopBarButton from "../TopBarButton";
import LogOutMenuItem from "./LogOutMenuItem";
import MenuItem from "./MenuItem";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        }
    }),
);

const AccountInfo: React.FC = () => {
    const {t} = useTranslation()
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event?: React.MouseEvent<HTMLButtonElement>) => {
        event && setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <div className={classes.root}>
        {/*TODO: use user's avatar instead of the predefined icon*/}
        <TopBarButton alt={t('topBar.showAccountMenu')} svg={info} onClick={handleClick} aria-controls="simple-menu" aria-haspopup="true"/>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem disabled={true}>{t('topBar.account.account')}</MenuItem>
            <MenuItem disabled={true}>{t('topBar.account.ideas')}</MenuItem>
            <MenuItem disabled={true}>{t('topBar.account.proposals')}</MenuItem>
            <MenuItem disabled={true}>{t('topBar.account.bounties')}</MenuItem>
            <Divider/>
            <LogOutMenuItem/>
        </Menu>
    </div>
}

export default AccountInfo
