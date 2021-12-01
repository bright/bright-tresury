import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import PublicBountyDiscussion from './PublicBountyDiscussion'

interface OwnProps {
    bountyIndex: number
}
export type BountyDiscussionProps = OwnProps
const BountyDiscussion = ({ bountyIndex }: BountyDiscussionProps) => {
    const { user, isUserSignedIn } = useAuth()

    return (
        // TODO in TREAS-203 <>
        //     {user && isUserSignedIn ? (
        //         <PrivateBountyDiscussion proposalIndex={proposalIndex} userId={user.id} />
        //     ) : (
        <PublicBountyDiscussion bountyIndex={bountyIndex} />
        //     )}
        // </>
    )
}

export default BountyDiscussion
