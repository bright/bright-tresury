import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'
import CloseButton from '../../closeIcon/CloseButton'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            padding: '32px 80px 24px 42px',
            height: '100%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '24px 2.2em 24px 2.2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative',
        },
    }),
)

interface OwnProps {
    onClose: () => void
}
export type HeaderContainerProps = PropsWithChildren<OwnProps>

const HeaderContainer = ({ onClose, children }: HeaderContainerProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <CloseButton onClose={onClose} />
            {children}
        </div>
    )
}
export default HeaderContainer
