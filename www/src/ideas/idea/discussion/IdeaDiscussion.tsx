import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DiscussionContainer from './DiscussionContainer'
import DiscussionHeader from './DiscussionHeader'
import DiscussionCommentsContainer from './DiscussionCommentsContainer'
import EnterCommentComponent from './EnterCommentComponent'
import CommentComponent from './CommentComponent'

export const IdeaDiscussion = () => {
    const comments = [
        {
            authorThumb: 'S',
            author: 'Sasha_Moshito',
            timestamp: Date.now() - 1000 * 60 * 2,
            thumbsUpCount: 4,
            thumbsDownCount: 2,
            content:
                'Dear Farah, thank you for asking. I think the idea is brilliant, however needs some clarification. Please let me know if you have someone who will help you in developing the project? What are the threads if the project is not developed well?',
        },
        {
            authorThumb: 'F',
            author: 'Farah',
            timestamp: Date.now() - 1000 * 60 * 12,
            thumbsUpCount: 1,
            thumbsDownCount: 0,
            content:
                '@Sasha_Moshito could you please look at my idea for the proposal and let me know it is worth doing it and if it is an interesting topic to develop?',
        },
    ]
    return (
        <DiscussionContainer>
            <DiscussionHeader />
            <DiscussionCommentsContainer>
                <EnterCommentComponent />
                {comments.map((comment, index) => (
                    <CommentComponent key={index} comment={comment} />
                ))}
            </DiscussionCommentsContainer>
        </DiscussionContainer>
    )
}
