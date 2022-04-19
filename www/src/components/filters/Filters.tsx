import { createStyles, Hidden } from '@material-ui/core'
import { breakpoints } from '../../theme/theme'
import Tabs, { TabEntry } from '../tabs/Tabs'
import NavSelect from '../select/NavSelect'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        filterSelect: {
            fontWeight: 600,
            display: 'initial',
        },
    }),
)

interface OwnProps {
    searchParamName: string
    currentFilterOption: TabEntry
    filterOptions: TabEntry[]
}

export type FiltersProps = OwnProps

const Filters = ({ searchParamName, currentFilterOption, filterOptions }: FiltersProps) => {
    const classes = useStyles()

    return (
        <>
            <Hidden only={[breakpoints.mobile, breakpoints.tablet]}>
                <Tabs searchParamName={searchParamName} values={filterOptions} />
            </Hidden>
            <Hidden mdUp={true}>
                <NavSelect className={classes.filterSelect} value={currentFilterOption} options={filterOptions} />
            </Hidden>
        </>
    )
}
export default Filters
