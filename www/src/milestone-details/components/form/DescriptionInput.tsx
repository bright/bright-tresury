import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../components/form/input/textFieldStyles'
import Markdown from '../../../components/markdown/Markdown'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { theme } from '../../../theme/theme'
import { Nil } from '../../../util/types'
import { Label } from '../../../components/text/Label'

const useStyles = makeStyles(() =>
    createStyles({
        markdown: {
            background: theme.palette.background.paper,
            position: 'relative',
            top: '-30px',
            padding: '0 20px 0 20px',
        },
    }),
)

interface OwnProps {
    readonly: boolean
    description?: Nil<string>
}

export type DescriptionInputProps = OwnProps

const DescriptionInput = ({ readonly, description }: DescriptionInputProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <>
            {readonly ? (
                <>
                    <Label label={t(`milestoneDetails.form.description`)} />
                    <Markdown className={classes.markdown}>{description ?? ''}</Markdown>
                </>
            ) : (
                <Input
                    name="description"
                    label={t(`milestoneDetails.form.description`)}
                    placeholder={t(`milestoneDetails.form.describeMilestone`)}
                    disabled={readonly}
                    rows={4}
                    multiline={true}
                    textFieldColorScheme={TextFieldColorScheme.Dark}
                    variant={readonly ? 'text' : 'markdown'}
                />
            )}
        </>
    )
}

export default DescriptionInput
