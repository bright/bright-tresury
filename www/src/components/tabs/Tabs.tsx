import React from 'react'
import { createStyles } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TabLabel from './TabLabel'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
            display: 'flex',
            flexWrap: 'nowrap',
        },
    }),
)

export interface TabEntry {
    label: string
    path: string
    filterName: string
    svg?: string
    isDefault?: boolean
    notificationsCount?: number
}

interface OwnProps {
    values: TabEntry[]
    searchParamName?: string
}

export type TabsProps = OwnProps

const Tabs = ({ values, searchParamName }: TabsProps) => {
    const classes = useStyles()
    return (
        <div>
            <div className={classes.root}>
                {values
                    ? values.map(({ label, path, svg, isDefault, filterName, notificationsCount }) => (
                          <TabLabel
                              key={label}
                              isDefault={isDefault}
                              label={label}
                              svg={svg}
                              path={path}
                              filterName={filterName}
                              searchParamName={searchParamName}
                              notificationsCount={notificationsCount}
                          />
                      ))
                    : null}
            </div>
        </div>
    )
}

export default Tabs
