import identityIconSrc from '../assets/identity.svg'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { MouseEventHandler } from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        icon: {
            marginTop: '5px',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    }),
)

interface OwnProps {
    onClick: MouseEventHandler
}

export type AccountInformationIconProps = OwnProps

const AccountInformationIcon = ({ onClick }: AccountInformationIconProps) => {
    const classes = useStyles()

    return <img className={classes.icon} onClick={onClick} src={identityIconSrc} alt={''} />
}

export default AccountInformationIcon
