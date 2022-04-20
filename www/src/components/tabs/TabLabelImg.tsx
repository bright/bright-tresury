import { createStyles } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginRight: '10px',
            display: 'flex',
        },
        icon: {
            height: '20px',
        },
        notifications: {
            position: 'absolute',
            marginLeft: '8px',
            marginTop: '-6px',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.background.default,
            fontSize: '8px',
            lineHeight: '16px',
            textAlign: 'center',
        },
    }),
)

interface OwnProps {
    svg?: string
    notificationsCount?: number
}

export type TabLabelImgProps = OwnProps

const TabLabelImg = ({ svg, notificationsCount = 0 }: TabLabelImgProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {!!notificationsCount ? <div className={classes.notifications}>{notificationsCount}</div> : null}
            <img className={classes.icon} src={svg} alt={''} />
        </div>
    )
}

export default TabLabelImg
