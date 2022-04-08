import HeaderListContainer, { mobileHeaderListHorizontalMargin } from '../components/header/list/HeaderListContainer'
import BasicInfo from '../components/header/BasicInfo'
import Button from '../components/button/Button'
import FlexBreakLine from '../components/header/FlexBreakLine'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import clsx from 'clsx'
import TimeSelect from '../components/select/TimeSelect'
import PaperFilterBackground from '../components/header/list/PaperFilterBackground'
import HeaderListTabs from '../components/header/list/HeaderListTabs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles, Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newTipButton: {
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
        statusFilters: {
            overflowX: 'auto',
            order: 4,
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'none',
            },
        },
        paperBackground: {
            order: 4,
        },
    }),
)
const TipsHeader = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const goToNewTip = () => {
        // TODO: fill with TREAS-442 or TREAS-478
    }

    return (
        <HeaderListContainer>
            <BasicInfo>
                <Button className={classes.newTipButton} variant="contained" color="primary" onClick={goToNewTip}>
                    {t('tips.list.createTip')}
                </Button>
            </BasicInfo>
            <FlexBreakLine className={classes.flexBreakLine} />
            <TimeSelectWrapper className={clsx(classes.displayOnMobile, classes.timeSelectWrapper)}>
                <TimeSelect />
            </TimeSelectWrapper>
            <PaperFilterBackground className={clsx(classes.displayOnMobile, classes.paperBackground)} />
            <HeaderListTabs className={clsx(classes.statusFilters, classes.displayOnMobile)}>
                <></>
            </HeaderListTabs>
            <div className={classes.buttonsContainer}>
                <TimeSelectWrapper className={clsx(classes.timeSelectWrapper)}>
                    <TimeSelect />
                </TimeSelectWrapper>
                <PaperFilterBackground className={classes.paperBackground} />
                <HeaderListTabs className={classes.statusFilters}>
                    <></>
                </HeaderListTabs>
            </div>
        </HeaderListContainer>
    )
}
export default TipsHeader
