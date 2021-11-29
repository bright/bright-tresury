import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { ButtonBase, createStyles } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { match } from 'react-router'
import { breakpoints } from '../../theme/theme'
import { Location } from 'history'
import TabLabelImg from './TabLabelImg'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '8px 18px !important',
            fontWeight: 400,
            fontSize: '16px',
            fontFamily: theme.typography.fontFamily,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '17px',
            },
            marginRight: '1em',
            color: theme.palette.text.primary,
            border: `solid 2px ${theme.palette.background.paper}`,
            borderRadius: '8px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
        },
        selected: {
            border: `solid 2px ${theme.palette.primary.main}`,
        },
    }),
)

interface OwnProps {
    label: string
    filterName: string
    path: string
    notificationsCount?: number
    svg?: string
    isDefault?: boolean
    searchParamName?: string
}

export type TabLabelProps = OwnProps

const TabLabel = ({ label, filterName, svg, path, isDefault, searchParamName, notificationsCount }: TabLabelProps) => {
    const classes = useStyles()

    const isActive = (match: match | null, location: Location) => {
        if (!searchParamName) {
            // path tabs
            if (match) {
                return true
            }
            const isActiveByDefault = isDefault === true && `${location.pathname}/${filterName}` === path
            return isActiveByDefault
        } else {
            // search param tabs
            const searchParamFilter = searchParamName
                ? new URLSearchParams(location.search).get(searchParamName)
                : undefined
            if (searchParamFilter && searchParamFilter === filterName) {
                return true
            }
            if (!searchParamFilter && isDefault) {
                // if no search param and the button is default
                return true
            }
            return false
        }
    }

    return (
        <ButtonBase centerRipple={true}>
            <NavLink
                className={classes.root}
                to={path}
                replace={true}
                isActive={isActive}
                activeClassName={classes.selected}
            >
                {svg ? <TabLabelImg svg={svg} notificationsCount={notificationsCount} /> : null}
                {label}
            </NavLink>
        </ButtonBase>
    )
}

export default TabLabel
