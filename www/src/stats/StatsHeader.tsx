import React from 'react'
import Button from '../components/button/Button'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import HeaderListContainer, { mobileHeaderListHorizontalMargin } from '../components/header/list/HeaderListContainer'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import { makeStyles, Theme } from '@material-ui/core'
import { ROUTE_NEW_IDEA } from '../routes/routes'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Time } from '@polkadot/util/types'
import { timeToString } from '../util/dateUtil'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newIdeaButton: {
            margin: '0',
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                width: '100%',
            },
        },
        timeSelectWrapper: {
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                background: theme.palette.background.default,
                padding: 0,
                marginTop: '10px',
            },
        },
        timeInfo: {
            padding: '0 10px 0 10px',
            fontSize: '16px',
            fontWeight: 'normal',
        },
        timeInfoBold: {
            fontWeight: 'bold',
        },
        buttonsContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                flexDirection: 'column',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
            },
        },
    }),
)

interface OwnProps {
    timeLeft?: Time
}

export type StatsHeaderProps = OwnProps

const StatsHeader = ({ timeLeft }: StatsHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    const timeLeftLabel = timeLeft ? timeToString(timeLeft, t) : ''

    return (
        <HeaderListContainer>
            <div className={classes.buttonsContainer}>
                <Button className={classes.newIdeaButton} variant="contained" color="primary" onClick={goToNewIdea}>
                    {t('idea.introduce')}
                </Button>
                <TimeSelectWrapper className={classes.timeSelectWrapper}>
                    <p className={classes.timeInfo}>
                        {t(`stats.currentSpendPeriod`)}:{' '}
                        <span className={classes.timeInfoBold}>{timeLeftLabel}</span>
                    </p>
                </TimeSelectWrapper>
            </div>
        </HeaderListContainer>
    )
}

export default StatsHeader
