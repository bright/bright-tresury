import React from 'react'
import Button from '../components/button/Button'
import IdeaStatusFilters, { IdeaFilter } from './list/IdeaStatusFilters'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import { useTranslation } from 'react-i18next'
import { ROUTE_NEW_IDEA } from '../routes/routes'
import { useHistory } from 'react-router-dom'
import TimeSelect, { TimeFrame } from '../components/select/TimeSelect'
import HeaderListContainer, { mobileHeaderListHorizontalMargin } from '../components/header/list/HeaderListContainer'
import BasicInfo from '../components/header/BasicInfo'
import FlexBreakLine from '../components/header/FlexBreakLine'
import HeaderListTabs from '../components/header/list/HeaderListTabs'
import PaperFilterBackground from '../components/header/list/PaperFilterBackground'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newIdeaButton: {
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
                flex: 1,
            },
        },
        flexBreakLine: {
            order: 2,
            [theme.breakpoints.only(breakpoints.tablet)]: {
                order: 3,
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
        paperBackground: {
            order: 4,
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
        buttonsContainer: {
            order: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
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
    }),
)

interface OwnProps {
    selectedFilter: IdeaFilter
}

export type IdeasHeaderProps = OwnProps

const IdeasHeader = ({ selectedFilter }: IdeasHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    return (
        <HeaderListContainer>
            <BasicInfo>
                <Button className={classes.newIdeaButton} variant="contained" color="primary" onClick={goToNewIdea}>
                    {t('idea.introduce')}
                </Button>
            </BasicInfo>
            <FlexBreakLine className={classes.flexBreakLine} />
            <PaperFilterBackground className={clsx(classes.displayOnMobile, classes.paperBackground)} />
            <HeaderListTabs className={clsx(classes.statusFilters, classes.displayOnMobile)}>
                <IdeaStatusFilters selectedFilter={selectedFilter} />
            </HeaderListTabs>
            <div className={classes.buttonsContainer}>
                <PaperFilterBackground className={classes.paperBackground} />
                <HeaderListTabs className={classes.statusFilters}>
                    <IdeaStatusFilters selectedFilter={selectedFilter} />
                </HeaderListTabs>
            </div>
        </HeaderListContainer>
    )
}

export default IdeasHeader
