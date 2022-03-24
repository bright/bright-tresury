import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useAuth } from '../../../../auth/AuthContext'
import { CommentDto, DiscussionDto } from '../../../comments.dto'
import { ReactionDto, ReactionType } from '../reactions.dto'
import ReactionIcon from './ReactionIcon'
import ReactionsCount from './ReactionsCount'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            padding: '12px 2px',
        },
    }),
)

interface OwnProps {
    name: ReactionType
    reactions: ReactionDto[]
    comment: CommentDto
    discussion: DiscussionDto
}

export type ReactionProps = OwnProps

const Reaction = ({ name, reactions, comment, discussion }: ReactionProps) => {
    const classes = useStyles()
    const { user } = useAuth()

    const usersReaction = reactions.find((r) => r.author.userId === user?.id)

    return (
        <div className={classes.root}>
            <ReactionIcon name={name} usersReaction={usersReaction} comment={comment} discussion={discussion} />
            <ReactionsCount reactions={reactions} usersReaction={usersReaction} />
        </div>
    )
}
export default Reaction
