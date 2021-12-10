import React, { useEffect, useState } from 'react'
import HeaderContainer from '../header/details/HeaderContainer'
import { useHistory } from 'react-router-dom'
import Markdown from 'react-markdown'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        lineBreak: {
            width: '100%',
            whiteSpace: 'normal',
        },
    }),
)

interface OwnProps {
    markdownFile: string
}

export type DisplayMarkdownProps = OwnProps

const DisplayMarkdown = ({ markdownFile }: DisplayMarkdownProps) => {
    const history = useHistory()
    const classes = useStyles()

    const goBack = () => {
        history.goBack()
    }

    let [markdownText, setMarkdownText] = useState('')

    useEffect(() => {
        fetch(markdownFile)
            .then((markdown) => markdown.text())
            .then((markdownText) => {
                setMarkdownText(markdownText)
            })
    }, [])

    return (
        <HeaderContainer onClose={goBack}>
            <Markdown className={classes.lineBreak} children={markdownText} />
        </HeaderContainer>
    )
}

export default DisplayMarkdown
