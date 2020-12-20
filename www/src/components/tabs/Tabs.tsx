import React from "react";
import {Tabs as MaterialTabs, Tab as MaterialTab, TabsProps, createStyles, TabClassKey} from '@material-ui/core';
import {makeStyles, Theme} from "@material-ui/core/styles";

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

interface Props {
    values: { label: string, value: string }[],
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
        {values ? values.map(({value, label}) =>
            <MaterialTab
                classes={tabClasses}
                label={label}
                value={value}
                key={value}/>
        ) : null}
    </MaterialTabs>
}
