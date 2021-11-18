import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Button from '../components/button/Button'
import HeaderListContainer from '../components/header/list/HeaderListContainer'
import { ROUTE_NEW_BOUNTY } from '../routes/routes'
import TimeSelectWrapper from '../components/header/list/TimeSelectWrapper'
import { makeStyles, Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles'
import { breakpoints } from '../theme/theme'
import clsx from 'clsx'
import { TimeSelect } from '../components/select/TimeSelect'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        timeSelectWrapper: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                background: theme.palette.background.default,
                padding: 0,
                marginTop: '10px',
            },
        },
    }),
)

interface OwnProps {}

export type BountiesHeaderProps = OwnProps

const BountiesHeader = ({}: BountiesHeaderProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const classes = useStyles()

    const goToNewBounty = () => {
        history.push(ROUTE_NEW_BOUNTY)
    }

    return (
        <HeaderListContainer>
            <Button variant="contained" color="primary" onClick={goToNewBounty}>
                {t('bounty.list.createBounty')}
            </Button>
            <TimeSelectWrapper className={clsx(classes.timeSelectWrapper)}>
                <TimeSelect />
            </TimeSelectWrapper>
        </HeaderListContainer>
    )
}

export default BountiesHeader
