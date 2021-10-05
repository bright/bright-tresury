import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: '1em',
        },
        hash: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: theme.palette.text.disabled,
            marginRight: '2px',
        },
        ordinalNumber: {
            fontWeight: 'bold',
            marginRight: '8px',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
        },
    }),
)

interface OwnProps {
    ordinalNumber: number
    title: string
}

export type NotificationsItemTitleProps = OwnProps

const NotificationsItemTitle = ({ ordinalNumber, title }: NotificationsItemTitleProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <span className={classes.hash}>#</span>
            <span className={classes.ordinalNumber}>{ordinalNumber}</span>
            <span className={classes.title}>{title}</span>
        </div>
    )
}

export default NotificationsItemTitle
