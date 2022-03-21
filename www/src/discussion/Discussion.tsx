import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../auth/AuthContext'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { AuthorDto } from '../util/author.dto'
import { AccountInfo, Nil } from '../util/types'
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
    discussedEntity: DiscussedEntity | any // todo remove any once all duscussable entities have owners
    info?: Nil<React.ReactNode>
}

export interface DiscussedEntity {
    owner?: Nil<AuthorDto>
}

export type DiscussionProps = OwnProps

const Discussion = ({ discussion, info, discussedEntity }: DiscussionProps) => {
    const { t } = useTranslation()
    const { isUserSignedInAndVerified: canComment } = useAuth()

    const { status, data: comments } = useGetComments(discussion)

    const people: AuthorDto[] = useMemo(() => {
        if (!comments) {
            return []
        }
        const authors = new Map<string, AuthorDto>()

        // get comments authors
        comments.forEach(({ author }) => {
            if (author.status !== UserStatus.Deleted) authors.set(author.userId, author)
        })

        // get entity author
        if (discussedEntity?.owner) {
            authors.set(discussedEntity.owner.userId, discussedEntity.owner)
        }

        // TODO get blockchain accounts identities (proposer, curator, beneficiary) TREAS- 458

        return Array.from(authors.values())
    }, [comments])

    const renderComment = (comment: CommentDto) => (
        <DisplayComment key={comment.id} comment={comment} discussion={discussion} people={people} />
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
                    {canComment ? <CreateComment discussion={discussion} people={people} /> : null}
                    {comments?.length ? comments.map(renderComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}

export default Discussion
