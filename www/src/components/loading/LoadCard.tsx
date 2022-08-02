import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { Skeleton } from '@material-ui/lab'
import { breakpoints } from '../../theme/theme'
import Divider from '../divider/Divider'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            height: '190px',
            width: '45%',
            marginLeft: '20px',
            marginRight: '20px',
            marginBottom: '20px',
            borderRadius: '10px',
            background: theme.palette.background.default,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                marginTop: '20px',
            },
        },
        flex: {
            paddingLeft: '10px',
            paddingRight: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        avatar: {
            marginTop: '15px',
        },
    }),
)

const Card = () => {
    const classes = useStyles()
    return (
        <div className={classes.card}>
            <div className={classes.flex}>
                <Skeleton height={40} width={110} />
                <Skeleton height={40} width={110} />
            </div>
            <Divider />
            <div className={classes.flex}>
                <Skeleton height={70} width={180} />
                <Skeleton height={70} width={60} />
            </div>
            <Divider />
            <div className={classes.flex}>
                <Skeleton className={classes.avatar} variant={'circle'} height={40} width={40} />
                <Skeleton className={classes.avatar} height={40} width={200} />
            </div>
        </div>
    )
}

const LoadCard = () => {
    return (
        <Grid container>
            <Card />
            <Card />
            <Card />
            <Card />
        </Grid>
    )
}
export default LoadCard
