import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../auth/AuthContext'
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
import { PublicUserDto } from '../util/publicUser.dto'

interface OwnProps {
    discussion: DiscussionDto
    discussedEntity: DiscussedEntity
    info?: Nil<React.ReactNode>
}

export interface DiscussedEntity {
    owner?: Nil<PublicUserDto>
    proposer?: Nil<PublicUserDto>
    beneficiary?: Nil<PublicUserDto>
    curator?: Nil<PublicUserDto>
}

export type DiscussionProps = OwnProps

const Discussion = ({ discussion, info, discussedEntity }: DiscussionProps) => {
    const { t } = useTranslation()
    const { isUserSignedInAndVerified: canComment, user } = useAuth()

    const { status, data: comments } = useGetComments(discussion)

    const people: PublicUserDto[] = useMemo(() => {
        if (!comments) {
            return []
        }

        const authors = comments.map((comment) => comment.author)
        if (discussedEntity.owner) {
            authors.push(discussedEntity.owner)
        }
        if (discussedEntity.proposer) {
            authors.push(discussedEntity.proposer)
        }
        if (discussedEntity.beneficiary) {
            authors.push(discussedEntity.beneficiary)
        }
        if (discussedEntity.curator) {
            authors.push(discussedEntity.curator)
        }

        // to map to remove duplicates, deleted accounts, accounts with no userId and logged in user
        const authorsMap = new Map<string, PublicUserDto>()
        authors.forEach((author) => {
            if (author.status !== UserStatus.Deleted && author.userId && author.userId !== user?.id)
                authorsMap.set(author.userId!, author)
        })

        return Array.from(authorsMap.values())
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
