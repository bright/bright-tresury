import React from 'react'
import Button from '../components/button/Button'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import { TimeSelect } from '../components/select/TimeSelect'
import HeaderListContainer, { mobileHeaderListHorizontalMargin } from '../components/header/list/HeaderListContainer'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import { makeStyles, Theme } from '@material-ui/core'
import { ROUTE_NEW_IDEA } from '../routes/routes'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newIdeaButton: {
            margin: '0',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                width: '100%',
                marginBottom: '20px',
            },
        },
        timeSelectWrapper: {
            position: 'relative',
            margin: 0,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
            },
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

interface OwnProps {}

export type StatsHeaderProps = OwnProps

const StatsHeader = ({}: StatsHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    return (
        <HeaderListContainer>
            <div className={classes.buttonsContainer}>
                <Button className={classes.newIdeaButton} variant="contained" color="primary" onClick={goToNewIdea}>
                    {t('idea.introduce')}
                </Button>
                <TimeSelectWrapper className={classes.timeSelectWrapper}>
                    <TimeSelect />
                </TimeSelectWrapper>
            </div>
        </HeaderListContainer>
    )
}

export default StatsHeader
