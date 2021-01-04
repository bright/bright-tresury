import React, {useState} from "react";
import {Drawer} from "@material-ui/core";
import {MenuItem} from "./MenuItems";
import {useTranslation} from "react-i18next";
import MenuItemsList from "./MenuItemsList";

interface Props {
    currentItem: MenuItem,
    onItemSelected: (item: MenuItem) => void
}

const MenuMobileDrawer: React.FC<Props> = ({currentItem, onItemSelected}) => {
    const {t} = useTranslation()

    const container =
        window !== undefined ? () => window.document.body : undefined;

    const [drawerState, setDrawerState] = useState(true)

    return <>
        <div>Current Menu Item{t(currentItem.translationKey)}</div>
        <Drawer
            container={container}
            onClose={() => setDrawerState(false)}
            anchor={'top'}
            variant="permanent">
            <MenuItemsList currentItem={currentItem} onItemSelected={onItemSelected}/>
        </Drawer>
    </>
}

export default MenuMobileDrawer
