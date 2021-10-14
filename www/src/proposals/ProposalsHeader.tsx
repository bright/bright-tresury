import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import { Trans } from 'react-i18next'
import ProposalStatusFilters, { ProposalFilter } from './list/ProposalStatusFilters'
import { ROUTE_NEW_IDEA } from '../routes/routes'
import { TimeSelect } from '../components/select/TimeSelect'
import BasicInfo from '../components/header/BasicInfo'
import FlexBreakLine from '../components/header/FlexBreakLine'
import HeaderListContainer from '../components/header/list/HeaderListContainer'
import HeaderListTabs from '../components/header/list/HeaderListTabs'
import PaperFilterBackground from '../components/header/list/PaperFilterBackground'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import RouterLink from '../components/link/RouterLink'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        flexBreakLine: {
            order: 2,
            [theme.breakpoints.only(breakpoints.tablet)]: {
                order: 3,
            },
        },
        timeSelectWrapper: {
            display: 'flex',
            alignItems: 'center',
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                display: 'flex',
                alignItems: 'center',
            },
        },
        paperBackground: {
            order: 3,
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
        statusFilters: {
            overflowX: 'auto',
            order: 3,
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
    })
})

interface OwnProps {
    selectedFilter: ProposalFilter
}

export type ProposalsHeaderProps = OwnProps

const ProposalsHeader = ({ selectedFilter }: ProposalsHeaderProps) => {
    const classes = useStyles()

    return (
        <HeaderListContainer>
            <BasicInfo>
                <Trans
                    i18nKey="proposal.list.introduceIdea"
                    components={{
                        a: <RouterLink to={ROUTE_NEW_IDEA} />,
                    }}
                />
            </BasicInfo>
            <FlexBreakLine className={classes.flexBreakLine} />
            <TimeSelectWrapper className={clsx(classes.displayOnMobile, classes.timeSelectWrapper)}>
                <TimeSelect />
            </TimeSelectWrapper>
            <PaperFilterBackground className={clsx(classes.displayOnMobile, classes.paperBackground)} />
            <HeaderListTabs className={clsx(classes.statusFilters, classes.displayOnMobile)}>
                <ProposalStatusFilters selectedFilter={selectedFilter} />
            </HeaderListTabs>
            <div className={classes.buttonsContainer}>
                <TimeSelectWrapper className={classes.timeSelectWrapper}>
                    <TimeSelect />
                </TimeSelectWrapper>
                <PaperFilterBackground className={classes.paperBackground} />
                <HeaderListTabs className={classes.statusFilters}>
                    <ProposalStatusFilters selectedFilter={selectedFilter} />
                </HeaderListTabs>
            </div>
        </HeaderListContainer>
    )
}

export default ProposalsHeader
