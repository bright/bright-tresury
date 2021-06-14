import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: '24px',
            marginRight: '.5em',
            fontSize: 18,
            flexBasis: '100%',
            textOverflow: 'ellipsis',
        },
    }),
)
interface OwnProps {}
export type TitleProps = PropsWithChildren<OwnProps>
const Title = ({ children }: TitleProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default Title
