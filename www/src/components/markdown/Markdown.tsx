import React from 'react'
import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'

const Markdown = ({ children, className }: ReactMarkdownOptions) => {
    return (
        <div className={className}>
            <ReactMarkdown>{children}</ReactMarkdown>
        </div>
    )
}

export default Markdown
