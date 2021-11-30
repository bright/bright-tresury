import React from 'react'
import { formatAddress } from '../identicon/utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useNetworks } from '../../networks/useNetworks'
import { ClassNameProps } from '../props/className.props'
import { AuthorDto } from '../../util/author.dto'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        author: {
            paddingTop: '6px',
            marginLeft: '16px',
            fontWeight: 600,
        },
    }),
)

interface OwnProps {
    author: Pick<AuthorDto, 'isEmailPasswordEnabled' | 'username' | 'web3address'>
}
export type AuthorProps = OwnProps & ClassNameProps
const Author = ({ author: { isEmailPasswordEnabled, username, web3address } }: AuthorProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    return (
        <div className={classes.author}>
            {isEmailPasswordEnabled ? username : formatAddress(web3address, network.ss58Format)}
        </div>
    )
}
export default Author