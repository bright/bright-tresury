import React from 'react'
import DiscussionContainer from './DiscussionContainer'
import DiscussionHeader from './DiscussionHeader'
import DiscussionCommentsContainer from './DiscussionCommentsContainer'
import EnterComment from '../../../components/enterComment/EnterComment'
import DisplayComment from './DisplayComment'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useCreateIdeaComment, useGetIdeaComments } from './idea.comments.api'
import { useAuth } from '../../../auth/AuthContext'
import { CreateIdeaCommentDto } from './idea.comment.dto'
import { useQueryClient } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        noComments: {
            fontSize: '16px',
        },
    }),
)

interface OwnProps {
    ideaId: string
}
export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ ideaId }: IdeaDiscussionProps) => {
    const { status, data: ideaComments } = useGetIdeaComments(ideaId)
    const { isUserSignedInAndVerified: canComment, user } = useAuth()
    const { t } = useTranslation()
    const classes = useStyles()
    const { mutateAsync } = useCreateIdeaComment()
    const queryClient = useQueryClient()
    const onSendClick = async (commentContent: string) => {
        if (!canComment) {
            // user is not allowed to post comments (possible not logged in or not verified)
            return
        }
        const ideaCommentDto = {
            content: commentContent,
        } as CreateIdeaCommentDto

        await mutateAsync(
            { ideaId: ideaId, data: ideaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdea')}
                loadingText={t('loading.idea')}
            >
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterComment onSendClick={onSendClick} /> : null}
                    {ideaComments?.length ? (
                        ideaComments.map((comment, index) => <DisplayComment key={index} comment={comment} />)
                    ) : (
                        <p className={classes.noComments}>{t('discussion.noComments')}</p>
                    )}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}
export default IdeaDiscussion
