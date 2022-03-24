import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ReactionDto } from '../reactions.dto'
import ReactionCountLabel from './ReactionCountLabel'
import ReactionTooltip from './ReactionTooltip'

const useStyles = makeStyles((theme) =>
    createStyles({
        inActive: { color: theme.palette.text.disabled },
    }),
)

interface OwnProps {
    reactions: ReactionDto[]
    usersReaction?: ReactionDto
}

export type ReactionsCountProps = OwnProps

const ReactionsCount = ({ reactions, usersReaction }: ReactionsCountProps) => {
    const classes = useStyles()

    const count = reactions.length

    return (
        <>
            {count ? (
                <ReactionTooltip reactions={reactions} usersReaction={usersReaction} />
            ) : (
                <ReactionCountLabel className={classes.inActive}>{count}</ReactionCountLabel>
            )}
        </>
    )
}

export default ReactionsCount
