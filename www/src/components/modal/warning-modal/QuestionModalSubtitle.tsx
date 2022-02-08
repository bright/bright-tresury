import React from 'react'

interface OwnProps {
    subtitle: string
}

export type QuestionModalSubtitleProps = OwnProps

const QuestionModalSubtitle = ({ subtitle }: QuestionModalSubtitleProps) => {
    return <p id="modal-description">{subtitle}</p>
}

export default QuestionModalSubtitle
