import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { PolkassemblyPostDto } from './PolkassemblyShareModal'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            overflowY: 'scroll',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            borderStyle: 'solid',
            borderWidth: '4px 4px 4px 4px',
            borderColor: theme.palette.background.paper,
            fontFamily: 'Roboto',
            padding: '1.5em',
            // styles for the scroll shadow
            backgroundImage: `linear-gradient(to top, white, white),
            linear-gradient(to top, white, white),
            linear-gradient(to top, rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0)),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0))`,
            backgroundPosition: 'bottom center, top center, bottom center, top center',
            backgroundColor: 'white',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 10px, 100% 10px, 100% 10px, 100% 10px',
            backgroundAttachment: 'local, local, scroll, scroll',
        },
        title: {
            fontSize: '2rem',
            marginTop: '0',
        },
        link: {
            color: '#c40061',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'none',
            },
        },
    }),
)

interface OwnProps {
    postData: PolkassemblyPostDto
}

export type PolkassemblyPostPreviewProps = OwnProps

const PolkassemblyPostPreview = ({ postData }: PolkassemblyPostPreviewProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <p className={classes.title}>{`#${postData.onChainIndex} ${postData.title}`}</p>
            <ReactMarkdown
                components={{
                    img: ({ node, ...props }) => <img {...props} />,
                    a: ({ node, ...props }) => <a {...props} className={classes.link} />,
                }}
            >
                {postData.content}
            </ReactMarkdown>
        </div>
    )
}

export default PolkassemblyPostPreview
