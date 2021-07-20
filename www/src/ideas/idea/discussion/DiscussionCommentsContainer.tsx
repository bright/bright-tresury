import React, { PropsWithChildren } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '60%',
        },
    }),
)

interface OwnProp {}

export type DiscussionCommentsContainerProps = PropsWithChildren<OwnProp>

const DiscussionCommentsContainer = ({ children }: DiscussionCommentsContainerProps) => {
    const styles = useStyles()
    return <div className={styles.root}>{children}</div>
}

export default DiscussionCommentsContainer
