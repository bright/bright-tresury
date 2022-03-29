import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { Mention, MentionsInput, MentionsInputProps } from 'react-mentions'
import useUserMention from './useUserMention'
import { PublicUserDto } from '../../../../util/publicUser.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        control: {
            height: '4em',
            fontFamily: theme.typography.fontFamily,
            fontSize: '14px',
            fontWeight: 500,
            outline: 'none',
            border: '1px solid',
            borderColor: theme.palette.background.paper,
            borderRadius: '3px',
            '& strong': {
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '3px',
            },
            '& textarea': {
                backgroundColor: 'green',
                border: 'none',
                resize: 'none',
                '&:focus-visible': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: theme.palette.primary.main,
                    borderRadius: '3px',
                },
            },
        },
        control__suggestions__list: {
            borderRadius: '8px',
            padding: '0px 0px !important',
            boxShadow: '0px 0px 60px #00000029',
        },
        'control__suggestions__item--focused': {
            backgroundColor: '#0025600B',
        },
    }),
)

interface OwnProps {
    people: PublicUserDto[]
}

export type CommentInputProps = OwnProps & Omit<MentionsInputProps, 'children'>

const CommentInput = ({ people, ...props }: CommentInputProps) => {
    const classes = useStyles()
    const userMentionProps = useUserMention({ people })

    return (
        <MentionsInput {...props} classNames={classes} ignoreAccents={true}>
            <Mention {...userMentionProps} />
        </MentionsInput>
    )
}
export default CommentInput
