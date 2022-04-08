import React from 'react'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import MDEditor from '@uiw/react-md-editor'

const Markdown = ({ children, className }: ReactMarkdownOptions) => {
    return (
        <div className={className}>
            <MDEditor.Markdown source={children} />
        </div>
    )
}

export default Markdown
