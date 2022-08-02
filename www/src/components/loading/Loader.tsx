import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { LinearProgress } from '@material-ui/core'
import LoadCard from './LoadCard'

const useStyles = makeStyles((theme: Theme) =>
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
    list?: boolean
}
export type LoaderProps = OwnProps
const Loader = ({ text, list }: LoaderProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <LinearProgress />
            <p className={classes.text}>{text}</p>
            {list ? <LoadCard /> : null}
        </div>
    )
}
export default Loader
