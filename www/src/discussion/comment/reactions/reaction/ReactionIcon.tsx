import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useQueryClient } from 'react-query'
import thumbDown from '../../../../assets/react_thumb_down.svg'
import thumbDownActive from '../../../../assets/react_thumb_down_active.svg'
import thumbUp from '../../../../assets/react_thumb_up.svg'
import thumbUpActive from '../../../../assets/react_thumb_up_active.svg'
import { useAuth } from '../../../../auth/AuthContext'
import IconButton from '../../../../components/button/IconButton'
import { COMMENTS_QUERY_KEY_BASE } from '../../../comments.api'
import { CommentDto, DiscussionDto } from '../../../comments.dto'
import { useCreateReaction, useDeleteReaction } from '../reactions.api'
import { ReactionDto, ReactionType } from '../reactions.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            margin: '0 0 0 8px',
            cursor: 'pointer',
            height: '16px',
            width: '16px',
        },
    }),
)

interface OwnProps {
    name: ReactionType
    usersReaction?: ReactionDto
    comment: CommentDto
    discussion: DiscussionDto
}

export type ReactionIconProps = OwnProps

const ReactionIcon = ({ name, usersReaction, comment, discussion }: ReactionIconProps) => {
    const classes = useStyles()
    const { isUserSignedInAndVerified } = useAuth()
    const deleteReaction = useDeleteReaction()
    const createReaction = useCreateReaction()
    const queryClient = useQueryClient()

    const onClick = async () => {
        if (usersReaction) {
            await deleteReaction.mutateAsync({ id: usersReaction.id, commentId: comment.id }, { onSuccess })
        } else {
            await createReaction.mutateAsync({ commentId: comment.id, name }, { onSuccess })
        }
    }

    const onSuccess = () => queryClient.invalidateQueries([COMMENTS_QUERY_KEY_BASE, discussion])

    const getIcon = () => {
        switch (name) {
            case ReactionType.ThumbUp:
                return !!usersReaction ? thumbUpActive : thumbUp
            case ReactionType.ThumbDown:
                return !!usersReaction ? thumbDownActive : thumbDown
        }
    }

    const disabled = !isUserSignedInAndVerified || deleteReaction.isLoading || createReaction.isLoading

    return <IconButton className={classes.root} onClick={onClick} svg={getIcon()} disabled={disabled} />
}

export default ReactionIcon
