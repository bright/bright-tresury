import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Button from '../components/button/Button'
import HeaderListContainer, { mobileHeaderListHorizontalMargin } from '../components/header/list/HeaderListContainer'
import { ROUTE_NEW_BOUNTY } from '../routes/routes'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import { makeStyles, Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import clsx from 'clsx'
import { TimeSelect } from '../components/select/TimeSelect'
import HeaderListTabs from '../components/header/list/HeaderListTabs'
import BountyStatusFilters, { BountyFilter } from './list/BountyStatusFilters'
import PaperFilterBackground from '../components/header/list/PaperFilterBackground'
import FlexBreakLine from '../components/header/FlexBreakLine'
import BasicInfo from '../components/header/BasicInfo'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newBountyButton: {
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
                flex: 1,
            },
        },
        timeSelectWrapper: {
            display: 'flex',
            alignItems: 'center',
            order: 5,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                display: 'flex',
                alignItems: 'center',
            },
        },
        statusFilters: {
            overflowX: 'auto',
            order: 4,
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'none',
            },
        },
        displayOnMobile: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'flex',
            },
        },
        flexBreakLine: {
            order: 2,
            [theme.breakpoints.only(breakpoints.tablet)]: {
                order: 3,
            },
        },
        buttonsContainer: {
            order: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'none',
            },
        },
        paperBackground: {
            order: 4,
        },
    }),
)

interface OwnProps {
    selectedFilter: BountyFilter
}

export type BountiesHeaderProps = OwnProps

const BountiesHeader = ({ selectedFilter }: BountiesHeaderProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const classes = useStyles()

    const goToNewBounty = () => {
        history.push(ROUTE_NEW_BOUNTY)
    }

    return (
        <HeaderListContainer>
            <BasicInfo>
                <Button className={classes.newBountyButton} variant="contained" color="primary" onClick={goToNewBounty}>
                    {t('bounty.list.createBounty')}
                </Button>
            </BasicInfo>
            <FlexBreakLine className={classes.flexBreakLine} />
            <TimeSelectWrapper className={clsx(classes.displayOnMobile, classes.timeSelectWrapper)}>
                <TimeSelect />
            </TimeSelectWrapper>
            <PaperFilterBackground className={clsx(classes.displayOnMobile, classes.paperBackground)} />
            <HeaderListTabs className={clsx(classes.statusFilters, classes.displayOnMobile)}>
                <BountyStatusFilters selectedFilter={selectedFilter} />
            </HeaderListTabs>
            <div className={classes.buttonsContainer}>
                <TimeSelectWrapper className={clsx(classes.timeSelectWrapper)}>
                    <TimeSelect />
                </TimeSelectWrapper>
                <PaperFilterBackground className={classes.paperBackground} />
                <HeaderListTabs className={classes.statusFilters}>
                    <BountyStatusFilters selectedFilter={selectedFilter} />
                </HeaderListTabs>
            </div>
        </HeaderListContainer>
    )
}

export default BountiesHeader
