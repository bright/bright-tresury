import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Placeholder from '../../../components/text/Placeholder'
import { Nil } from '../../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: '16px',
        },
        description: {
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        descriptionPlaceholder: {
            color: theme.palette.text.hint,
            fontWeight: 500,
        },
    }),
)

interface OwnProps {
    description: Nil<string>
    placeholder: string
}

export type MilestoneDescriptionProps = OwnProps

const MilestoneDescription = ({ description, placeholder }: MilestoneDescriptionProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {description ? (
                <div className={classes.description}>{description}</div>
            ) : (
                <Placeholder className={classes.descriptionPlaceholder} value={placeholder} />
            )}
        </div>
    )
}

export default MilestoneDescription
