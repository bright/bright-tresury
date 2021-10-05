import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { IdeaDto } from '../../ideas.dto'
import PrivateIdeaDiscussion from './PrivateIdeaDiscussion'
import PublicIdeaDiscussion from './PublicIdeaDiscussion'

interface OwnProps {
    idea: IdeaDto
}
export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ idea }: IdeaDiscussionProps) => {
    const { user, isUserSignedIn } = useAuth()

    return (
        <>
            {user && isUserSignedIn ? (
                <PrivateIdeaDiscussion idea={idea} userId={user.id} />
            ) : (
                <PublicIdeaDiscussion idea={idea} />
            )}
        </>
    )
}
export default IdeaDiscussion
