import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React from 'react'
import Divider from '../../divider/Divider'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '20px',
            margin: '0 2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                margin: '0 1em',
            },
        },
    }),
)
interface OwnProps {}
export type BasicInfoDividerProps = OwnProps
const BasicInfoDivider = ({}: BasicInfoDividerProps) => {
    const classes = useStyles()
    return <Divider className={classes.root} orientation="vertical" />
}
export default BasicInfoDivider
