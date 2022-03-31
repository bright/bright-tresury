import { Theme } from '@material-ui/core'
import AccountInformation from '../../account-information/AccountInformation'
import { UserDisplay } from './UserDisplay.'
import UserAvatar from './UserAvatar'
import { UserStatus } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            margin: '8px 5px',
            alignItems: 'center',
        },
    }),
)
// TODO: fix this interface in TREAS-457 task
interface OwnProps {
    user: {
        userId?: string
        username?: Nil<string>
        web3address?: Nil<string>
        status?: UserStatus
    }
    avatarSize?: number
    label?: string
    ellipsis?: boolean
    detectYou?: boolean
    showI?: boolean
}
export type UserProps = OwnProps & ClassNameProps

const User = ({ user, className, avatarSize, label, ellipsis = true, detectYou = true, showI = true }: UserProps) => {
    const classes = useStyles()
    return (
        <div className={clsx(classes.root, className)}>
            <UserAvatar user={user} size={avatarSize} />
            <UserDisplay user={user} label={label} ellipsis={ellipsis} detectYou={detectYou} />
            {showI && user.status !== UserStatus.Deleted && user.web3address ? (
                <AccountInformation address={user.web3address} />
            ) : null}
        </div>
    )
}
export default User
