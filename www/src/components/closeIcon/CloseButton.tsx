import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import IconButton from '../button/IconButton'
import crossSvg from '../../assets/cross.svg'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignSelf: 'self-start',
            margin: '0 0 2em 2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                position: 'relative',
                left: '20px',
                bottom: '15px',
                margin: '0',
            },
        },
    }),
)

interface OwnProps {
    onClose: () => void
}

export type CloseButtonProps = OwnProps & ClassNameProps

const CloseButton = ({ onClose, className = '' }: CloseButtonProps) => {
    const classes = useStyles()

    return <IconButton className={clsx(classes.root, className)} svg={crossSvg} onClick={onClose} />
}

export default CloseButton
