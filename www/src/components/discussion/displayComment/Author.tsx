import React from 'react'
import { CommentAuthorDto } from '../../../ideas/idea/discussion/idea.comment.dto'
import { formatAddress } from '../../../components/identicon/utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {useNetworks} from "../../../networks/useNetworks";
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
    author: Pick<CommentAuthorDto, 'isEmailPasswordEnabled' | 'username' | 'web3address'>
}
export type AuthorProps = OwnProps
const Author = ({ author: { isEmailPasswordEnabled, username, web3address } }: AuthorProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    return (
        <div className={classes.author}>{isEmailPasswordEnabled ? username : formatAddress(web3address, network.ss58Format)}</div>
    )
}
export default Author
