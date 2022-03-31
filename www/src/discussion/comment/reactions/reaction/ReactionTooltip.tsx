import { Tooltip } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import SuggestionItem from '../../components/input/SuggesionItem'
import { ReactionDto } from '../reactions.dto'
import ReactionCountLabel from './ReactionCountLabel'

const useStyles = makeStyles((theme) =>
    createStyles({
        tooltip: {
            backgroundColor: 'white',
            margin: 0,
            padding: 0,
            boxShadow: '0px 0px 60px #00000029',
            borderRadius: '8px',
        },
        usersReaction: {
            color: theme.palette.primary.main,
        },
    }),
)

interface OwnProps {
    reactions: ReactionDto[]
    usersReaction?: ReactionDto
}

export type ReactionTooltipProps = OwnProps

const ReactionTooltip = ({ reactions, usersReaction }: ReactionTooltipProps) => {
    const classes = useStyles()

    const count = reactions.length

    return (
        <Tooltip
            classes={classes}
            title={
                <div>
                    {reactions.map((reaction) => (
                        <SuggestionItem user={reaction.author} showI={false} />
                    ))}
                </div>
            }
        >
            <ReactionCountLabel className={usersReaction ? classes.usersReaction : ''}>{count}</ReactionCountLabel>
        </Tooltip>
    )
}

export default ReactionTooltip
