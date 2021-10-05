import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { LinearProgress } from '@material-ui/core'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        text: {
            marginLeft: '1em',
            marginRight: '1em',
            fontSize: '16px',
        },
    }),
)

export interface OwnProps {
    text: string
}
export type LoaderProps = OwnProps
const Loader = ({ text }: LoaderProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <LinearProgress />
            <p className={classes.text}>{text}</p>
        </div>
    )
}
export default Loader
