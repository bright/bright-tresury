import React, { useMemo } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { DiscussionCategory, IdeaDiscussionDto } from '../../../discussion/comments.dto'
import { IdeaDto } from '../../ideas.dto'
import PrivateIdeaDiscussion from './PrivateIdeaDiscussion'
import PublicIdeaDiscussion from './PublicIdeaDiscussion'

interface OwnProps {
    idea: IdeaDto
}
export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ idea }: IdeaDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()

    const discussion: IdeaDiscussionDto = useMemo(() => ({ category: DiscussionCategory.Idea, entityId: idea.id }), [
        idea,
    ])

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateIdeaDiscussion idea={idea} discussion={discussion} userId={user.id} />
            ) : (
                <PublicIdeaDiscussion idea={idea} discussion={discussion} />
            )}
        </>
    )
}
export default IdeaDiscussion
