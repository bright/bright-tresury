import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { Nil } from '../util/types'
import CreateComment from './comment/CreateComment'
import DisplayComment from './comment/DisplayComment'
import { useGetComments } from './comments.api'
import { CommentDto, DiscussionDto } from './comments.dto'
import DiscussionCommentsContainer from './list/DiscussionCommentsContainer'
import DiscussionContainer from './list/DiscussionContainer'
import DiscussionHeader from './list/header/DiscussionHeader'
import NoComments from './NoComments'

interface OwnProps {
    discussion: DiscussionDto
    info?: Nil<React.ReactNode>
}
export type DiscussionProps = OwnProps
const Discussion = ({ discussion, info }: DiscussionProps) => {
    const { t } = useTranslation()
    const { isUserSignedInAndVerified: canComment } = useAuth()

    const { status, data: comments } = useGetComments(discussion)

    const renderComment = (comment: CommentDto) => (
        <DisplayComment key={comment.id} comment={comment} discussion={discussion} />
    )

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingComments')}
                loadingText={t('loading.comments')}
            >
                <DiscussionHeader info={info} />
                <DiscussionCommentsContainer>
                    {canComment ? <CreateComment discussion={discussion} /> : null}
                    {comments?.length ? comments.map(renderComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}

export default Discussion
