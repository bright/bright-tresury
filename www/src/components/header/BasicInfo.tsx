import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            order: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '24px',
            marginRight: '32px',
            whiteSpace: 'pre-wrap',
            width: '40%',
        },
    }),
)
interface OwnProps {}
export type BasicInfoProps = PropsWithChildren<OwnProps>
const BasicInfo = ({ children }: BasicInfoProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default BasicInfo
