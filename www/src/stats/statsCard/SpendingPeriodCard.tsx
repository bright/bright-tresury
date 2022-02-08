import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '155px',
            background: theme.palette.background.default,
            borderRadius: '10px',
            opacity: '1',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        textName: {
            textAlign: `right`,
            color: theme.palette.text.disabled,
            fontSize: '18px',
            marginTop: '10px',
            position: 'relative',
            marginBottom: '20px',
        },
        infoDoughnut: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        percentagesDoughnut: {
            fontSize: '17px',
            position: 'relative',
            fontWeight: 'bold',
            bottom: '24px',
        },
        chartDoughnut: {
            position: 'relative',
            top: '20px',
        },
    }),
)

interface OwnProps {
    value: number
    name: string
}

export type SpendingPeriodCardProps = OwnProps

const SpendingPeriodCard = ({ value, name }: SpendingPeriodCardProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.infoDoughnut}>
                <CircularProgress
                    size={65}
                    className={classes.chartDoughnut}
                    value={value}
                    thickness={7}
                    variant="determinate"
                    color="primary"
                />
                <div className={classes.percentagesDoughnut}>{value}%</div>
                <div className={classes.textName}>{name}</div>
            </div>
        </div>
    )
}

export default SpendingPeriodCard
