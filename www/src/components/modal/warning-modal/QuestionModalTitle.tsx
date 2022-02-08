import React from 'react'

interface OwnProps {
    title: string
}

export type QuestionModalTitleProps = OwnProps

const QuestionModalTitle = ({ title }: QuestionModalTitleProps) => {
    return <h2 id="modal-title">{title}</h2>
}

export default QuestionModalTitle
