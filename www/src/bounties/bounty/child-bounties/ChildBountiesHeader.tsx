import TimeSelectWrapper from '../../../components/header/list/TimeSelectWrapper'
import clsx from 'clsx'
import TimeSelect from '../../../components/select/TimeSelect'
import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonsContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'none',
            },
        },
        timeSelectWrapper: {
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'flex',
                alignItems: 'center',
            },
        },
        displayOnMobile: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'flex',
            },
        },
    }),
)
interface OwnProps {}
export type ChildBountiesHeaderProps = OwnProps
const ChildBountiesHeader = ({}: ChildBountiesHeaderProps) => {
    const classes = useStyles()
    return (
        <>
            <TimeSelectWrapper className={clsx(classes.displayOnMobile, classes.timeSelectWrapper)}>
                <TimeSelect />
            </TimeSelectWrapper>
            <div className={classes.buttonsContainer}>
                <TimeSelectWrapper className={clsx(classes.timeSelectWrapper)}>
                    <TimeSelect />
                </TimeSelectWrapper>
            </div>
        </>
    )
}
export default ChildBountiesHeader
