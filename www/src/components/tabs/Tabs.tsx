import React from "react";
import {createStyles, Tab as MaterialTab, Tabs as MaterialTabs, TabsProps} from '@material-ui/core';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {TabLabel} from "./TabLabel";

const useTabsStyles = makeStyles((theme: Theme) =>
    createStyles({
        indicator: {
            display: 'none'
        }
    }))

const useTabStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '3px 18px !important',
            textTransform: 'initial',
            fontWeight: 600,
            fontSize: '16px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '17px',
            },
            marginRight: '1em',
            minWidth: 0,
            minHeight: 0,
            color: theme.palette.text.disabled,
            border: `solid 2px ${theme.palette.background.paper}`,
            borderRadius: '8px'
        },
        labelWrapper: {
            display: 'flex',
        },
        labelIcon: {
            marginRight: '10px'
        },
        selected: {
            border: `solid 2px ${theme.palette.primary.main}`,
        }
    }))

export interface TabEntry {
    value: string
    label: string
    path?: string
    svg?: string
}

interface Props {
    values: TabEntry[],
    value: string,
    handleChange: (value: string) => void
    svg?: string
}

export const Tabs: React.FC<Props & TabsProps> = ({value, values, handleChange, svg, ...props}) => {
    const tabClasses = useTabStyles()
    const tabsClasses = useTabsStyles()

    return <MaterialTabs
        {...props}
        value={value}
        classes={tabsClasses}
        onChange={(event, value) => handleChange(value)}>
        {values ? values.map(({value, label, path, svg}) =>
            <MaterialTab
                classes={tabClasses}
                label={<TabLabel label={label} svg={svg} path={path}/>}
                value={value}
                key={index}/>
        ) : null}
    </MaterialTabs>
}
