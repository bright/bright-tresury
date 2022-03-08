import React, { PropsWithChildren } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '75%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
    }),
)

interface OwnProp {}

export type DiscussionCommentsContainerProps = PropsWithChildren<OwnProp>

const DiscussionCommentsContainer = ({ children }: DiscussionCommentsContainerProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}

export default DiscussionCommentsContainer
