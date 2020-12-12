import React from "react";
import {createStyles, Tab as MaterialTab, Tabs as MaterialTabs, TabsProps} from '@material-ui/core';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {Link} from "react-router-dom";

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
        selected: {
            color: theme.palette.text.primary,
            border: `solid 2px ${theme.palette.primary.main}`,
        }
    }))

export interface TabEntry {
    value: string
    label: string
    path?: string
}

interface Props {
    values: TabEntry[],
    value: string,
    handleChange: (value: string) => void
}

export const Tabs: React.FC<Props & TabsProps> = ({value, values, handleChange, ...props}) => {
    const tabClasses = useTabStyles()
    const tabsClasses = useTabsStyles()

    return <MaterialTabs
        {...props}
        value={value}
        classes={tabsClasses}
        onChange={(event, value) => handleChange(value)}>
        {values ? values.map(({value, label, path}, index: number) =>
            <MaterialTab
                classes={tabClasses}
                label={path ? <Link to={path}>{label}</Link> : label}
                value={value}
                key={index}/>
        ) : null}
    </MaterialTabs>
}
