import { PolkassemblyPostDto } from './polkassembly-post.dto'
import Button from '../button/Button'
import ReactMarkdown from 'react-markdown'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { Nil } from '../../util/types'
const useStyles = makeStyles(() =>
    createStyles({
        polkassemblyButton: {
            marginTop: '2em'
        },
        markdownImg: {
            width: '100%'
        },
    }),
)
interface OwnProps {
    polkassemblyPostDto?: Nil<PolkassemblyPostDto>
    initialShow: boolean
}

export type PolkassemblyDescriptionProps = OwnProps

const PolkassemblyDescription = ({polkassemblyPostDto, initialShow}:PolkassemblyDescriptionProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [show, setShow] = useState(initialShow)
    const toggle = () => setShow(!show)

    if (!polkassemblyPostDto?.content)
        return null

    return (
        <>
            <Button
                onClick={toggle}
                variant="text"
                color="primary"
                className={classes.polkassemblyButton}
            >
                {t(
                    show
                        ? 'proposal.details.polkassemblyDescription.hide'
                        : 'proposal.details.polkassemblyDescription.show'
                )}
            </Button>
            {
                show
                    ? <ReactMarkdown components={{ img: ({node, ...props}) => <img className={classes.markdownImg} {...props}/> }}>
                        {polkassemblyPostDto.content}
                    </ReactMarkdown>
                    : null
            }
        </>
    )
}
export default PolkassemblyDescription
