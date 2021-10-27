import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import BountiesHeader from './BountiesHeader'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const Bounties = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <BountiesHeader />
        </div>
    )
}

export default Bounties
