import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '20px',
            marginBottom: '6px',
        },
    }),
)

export const CardHeader: React.FC = ({ children }) => {
    const classes = useStyles()

    return <div className={classes.root}>{children}</div>
}
