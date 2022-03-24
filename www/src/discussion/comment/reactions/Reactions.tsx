import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useCallback } from 'react'
import { enumKeys } from '../../../util/enumUtil'
import { CommentDto, DiscussionDto } from '../../comments.dto'
import Reaction from './reaction/Reaction'
import { ReactionDto, ReactionType } from './reactions.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
        },
    }),
)

interface OwnProps {
    comment: CommentDto
    discussion: DiscussionDto
}
export type ReactionsProps = OwnProps

const Reactions = ({ comment: { reactions }, comment, discussion }: ReactionsProps) => {
    const classes = useStyles()

    const reactionGroups = useCallback(() => {
        const result = new Map<ReactionType, ReactionDto[]>()

        enumKeys(ReactionType).forEach((key) => {
            result.set(ReactionType[key], [])
        })

        reactions.forEach((reaction) => {
            const collection = result.get(reaction.name)
            if (collection) {
                collection.push(reaction)
            }
        })
        return Array.from(result.entries())
    }, [reactions])

    return (
        <div className={classes.root}>
            {reactionGroups().map(([name, reactions]) => (
                <Reaction reactions={reactions} name={name} key={name} comment={comment} discussion={discussion} />
            ))}
        </div>
    )
}
export default Reactions
