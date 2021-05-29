import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '../button/IconButton'
import crossSvg from '../../assets/cross.svg'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            alignSelf: 'self-start',
            margin: '0 0 2em 2em',
        },
    }),
)

interface Props {
    onClose: () => void
}

export const CloseIcon: React.FC<Props & ClassNameProps> = ({ onClose, className = '' }) => {
    const classes = useStyles()

    return <IconButton className={clsx(classes.root, className)} svg={crossSvg} onClick={onClose} />
}
