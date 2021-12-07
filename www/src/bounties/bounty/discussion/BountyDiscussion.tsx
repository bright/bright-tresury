import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import PrivateBountyDiscussion from './PrivateBountyDiscussion'
import PublicBountyDiscussion from './PublicBountyDiscussion'

interface OwnProps {
    bountyIndex: number
}
export type BountyDiscussionProps = OwnProps
const BountyDiscussion = ({ bountyIndex }: BountyDiscussionProps) => {
    const { user, isUserSignedIn } = useAuth()

    return (
        <>
            {user && isUserSignedIn ? (
                <PrivateBountyDiscussion bountyIndex={bountyIndex} userId={user.id} />
            ) : (
                <PublicBountyDiscussion bountyIndex={bountyIndex} />
            )}
        </>
    )
}

export default BountyDiscussion
