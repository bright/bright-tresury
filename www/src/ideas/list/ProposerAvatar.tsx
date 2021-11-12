import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import clsx from 'clsx'
import { Nil } from '../../util/types'
import { ClassNameProps } from '../../components/props/className.props'
import { getInitials } from '../../components/avatar/initials.helpers'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '32px',
            lineHeight: '32px',
            width: '32px',
            borderRadius: '8px',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontSize: '22px',
            verticalAlign: 'center',
            textAlign: 'center',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                height: '42px',
                lineHeight: '42px',
                width: '42px',
            },
        },
    }),
)

interface OwnProps {
    username?: Nil<string>
}

export type ProposerAvatarProps = OwnProps & ClassNameProps & WithWidthProps

const ProposerAvatar = ({ username, className }: ProposerAvatarProps) => {
    const classes = useStyles()
    const initials = getInitials(username)

    return <div className={clsx(classes.root, className)}>{initials}</div>
}

export default ProposerAvatar
