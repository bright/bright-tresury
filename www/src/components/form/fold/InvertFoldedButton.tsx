import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonProps } from '../../button/Button'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '2em',
            alignSelf: 'flex-start',
        },
    }),
)
interface OwnProps {
    folded: boolean
    invertFolded: () => void
}

export type InvertFoldedButtonProps = OwnProps & ButtonProps

const InvertFoldedButton = ({ folded, invertFolded }: InvertFoldedButtonProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Button className={classes.root} variant="text" color="primary" onClick={invertFolded}>
            {folded ? t('form.fold.showAll') : t('form.fold.showLess')}
        </Button>
    )
}

export default InvertFoldedButton
