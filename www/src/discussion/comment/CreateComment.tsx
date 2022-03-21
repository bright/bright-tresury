import { Collapse } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { AuthorDto } from '../../util/author.dto'
import { COMMENTS_QUERY_KEY_BASE, useCreateComment } from '../comments.api'
import { DiscussionDto } from '../comments.dto'
import CancelSendButtons from './components/CancelSendButtons'
import CommentInput from './components/input/CommentInput'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '20px',
            padding: '18px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
        },
    }),
)

interface OwnProps {
    discussion: DiscussionDto
    people: AuthorDto[]
}
export type CreateCommentProps = OwnProps

const CreateComment = ({ discussion, people }: CreateCommentProps) => {
    const classes = useStyles()
    const [focus, setFocus] = useState(false)
    const [content, setContent] = useState('')
    const { t } = useTranslation()

    const { mutateAsync, isError, reset, isLoading } = useCreateComment()
    const queryClient = useQueryClient()

    const onSendClick = async () => {
        await mutateAsync(
            { content, discussionDto: discussion },
            {
                onSuccess: async () => {
                    setContent('')
                    await queryClient.refetchQueries([COMMENTS_QUERY_KEY_BASE, discussion])
                },
            },
        )
    }

    const onCancelClick = () => {
        setFocus(false)
        setContent('')
        reset()
    }

    return (
        <div className={clsx(classes.root)}>
            <CommentInput
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(event) => setContent(event.target.value)}
                value={content}
                people={people}
            />

            <Collapse in={!!(focus || content)}>
                <CancelSendButtons
                    onCancelClick={onCancelClick}
                    onSendClick={onSendClick}
                    error={isError ? t('discussion.sendCommentError') : null}
                    isLoading={isLoading}
                />
            </Collapse>
        </div>
    )
}
export default CreateComment
