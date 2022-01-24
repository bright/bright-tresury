import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import TopBarButton from '../TopBarButton'
import clsx from 'clsx'
import Avatar from '../../../components/avatar/Avatar'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '26px',
            lineHeight: '26px',
            width: '26px',
            borderRadius: '6px',
        },
        identicon: {
            backgroundColor: '#eeeeee',
        },
        avatar: {
            fontSize: '18px',
        },
    }),
)

const AccountImage = () => {
    const classes = useStyles()
    const { user } = useAuth()

    const address = user?.web3Addresses.find((address) => address.isPrimary)?.encodedAddress ?? ''

    return (
        <TopBarButton>
            <Avatar className={clsx(classes.root, classes.avatar)} username={user?.username} web3Address={address} />
        </TopBarButton>
    )
}

export default AccountImage
