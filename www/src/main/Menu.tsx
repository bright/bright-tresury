import { MenuItem, MenuList } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_ROOT } from '../routes';

const Menu: React.FC<{}> = () => {
    const history = useHistory()

    const goToStats = () => {
        history.push(ROUTE_ROOT)
    }

    const goToIdeas = () => {
        history.push(ROUTE_IDEAS)
    }

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <MenuList>
            <MenuItem onClick={goToStats}>Stats</MenuItem>
            <MenuItem onClick={goToIdeas}>Ideas</MenuItem>
            <MenuItem onClick={goToProposals}>Proposals</MenuItem>
            <MenuItem>Tips</MenuItem>
            <MenuItem>Bounty</MenuItem>
        </MenuList>
    );
}

export default Menu
