import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../auth/AuthContext'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useSuccessfullyLoadedItemStyles } from '../components/loading/useSuccessfullyLoadedItemStyles'
import { Nil } from '../util/types'
import CreateComment from './comment/CreateComment'
import DisplayComment from './comment/DisplayComment'
import { useGetComments } from './comments.api'
import { CommentDto, DiscussionDto } from './comments.dto'
import DiscussionCommentsContainer from './list/DiscussionCommentsContainer'
import DiscussionHeader from './list/header/DiscussionHeader'
import NoComments from './NoComments'
import { isPublicInAppUserDto, PublicInAppUserDto, PublicUserDto } from '../util/publicUser.dto'

interface OwnProps {
    discussion: DiscussionDto
    discussedEntity: DiscussedEntity
    info?: Nil<React.ReactNode>
}

export interface DiscussedEntity {
    owner?: Nil<PublicUserDto>
    proposer?: Nil<PublicUserDto>
    finder?: Nil<PublicUserDto>
    beneficiary?: Nil<PublicUserDto>
    curator?: Nil<PublicUserDto>
}

export type DiscussionProps = OwnProps

const Discussion = ({ discussion, info, discussedEntity }: DiscussionProps) => {
    const { t } = useTranslation()
    const classes = useSuccessfullyLoadedItemStyles()
    const { isUserSignedInAndVerified: canComment, user } = useAuth()

    const { status, data: comments } = useGetComments(discussion)

    const people: PublicInAppUserDto[] = useMemo(() => {
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
        if (discussedEntity.finder) {
            authors.push(discussedEntity.finder)
        }

        // to map to remove duplicates
        const authorsMap = new Map<string, PublicInAppUserDto>()
        authors.forEach((author) => {
            // include only if: in-app account, not deleted account and not the logged in user
            if (isPublicInAppUserDto(author) && author.status !== UserStatus.Deleted && author.userId !== user?.id) {
                // if `author` has userId, it is an in-app user so we can safely assert the type
                authorsMap.set(author.userId, author as PublicInAppUserDto)
            }
        })

        return Array.from(authorsMap.values())
    }, [comments])

    const renderComment = (comment: CommentDto) => (
        <DisplayComment key={comment.id} comment={comment} discussion={discussion} people={people} />
    )

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingComments')}
            loadingText={t('loading.comments')}
        >
            <div className={classes.content}>
                <DiscussionHeader info={info} />
                <DiscussionCommentsContainer>
                    {canComment ? <CreateComment discussion={discussion} people={people} /> : null}
                    {comments?.length ? comments.map(renderComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </div>
        </LoadingWrapper>
    )
}

export default Discussion
