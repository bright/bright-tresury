import React, { useRef, useState } from 'react'
import Link from '../../link/Link'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '75%',
            fontSize: '14px',
            color: theme.palette.text.primary,
            fontWeight: 600,
            marginBottom: '8px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        input: {
            width: '80%',
            padding: '4px 14px',
            border: 'none',
            borderRadius: '8px',
        },
        link: {
            margin: 'auto',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            textDecoration: 'none',
            padding: '4px 8px',
            color: theme.palette.text.secondary,
        },
    }),
)

interface OwnProps {
    value: string
    copyText?: string
    copiedText?: string
}

export type CopyInputValueProps = OwnProps

const CopyInputValue = ({ value, copyText, copiedText }: CopyInputValueProps) => {
    const classes = useStyles()
    const inputRef = useRef(null)
    const { t } = useTranslation()
    copyText = copyText ? copyText : t('copy')
    copiedText = copiedText ? copiedText : t('copied')
    const [linkText, setLinkText] = useState(copyText)

    const onCopyClick = () => {
        //@ts-ignore
        inputRef.current.select()
        document.execCommand('copy')
        setTimeout(() => {
            setLinkText(copyText)
        }, 500)
        setLinkText(copiedText)
    }
    return (
        <div className={classes.root}>
            <input className={classes.input} ref={inputRef} readOnly value={value} />
            <Link className={classes.link} onClick={onCopyClick}>
                {linkText}
            </Link>
        </div>
    )
}
export default CopyInputValue
