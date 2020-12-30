import {MenuItem, MenuList} from '@material-ui/core';
import React from 'react';
import {useHistory} from 'react-router-dom';
import {ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_ROOT} from '../routes';
import {useTranslation} from "react-i18next";
import {Divider} from "../components/divider/Divider";

const Menu: React.FC<{}> = () => {
    const history = useHistory()
    const {t} = useTranslation()

    const goToStats = () => {
        history.push(ROUTE_ROOT)
    }

    const goToIdeas = () => {
        history.push(ROUTE_IDEAS)
    }

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return <>
        <MenuList>
            <MenuItem onClick={goToStats}>{t('menu.stats')}</MenuItem>
            <MenuItem onClick={goToIdeas}>{t('menu.ideas')}</MenuItem>
            <MenuItem onClick={goToProposals}>{t('menu.proposals')}</MenuItem>
            <MenuItem>{t('menu.tips')}</MenuItem>
            <MenuItem>{t('menu.bounty')}</MenuItem>
        </MenuList>
    </>
}

export default Menu
