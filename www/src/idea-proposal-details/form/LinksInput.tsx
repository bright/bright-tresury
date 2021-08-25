import { createStyles, makeStyles } from '@material-ui/core/styles'
import { FieldArray } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { InputProps } from '../../components/form/input/Input'
import StyledInput from '../../components/form/input/StyledInput'
import { Nil } from '../../util/types'

export const linksValidationSchema = (t: (key: string) => string) =>
    Yup.array().of(
        Yup.string()
            .url(t('ideaProposalDetails.form.badLinkError'))
            .max(1000, t('ideaProposalDetails.form.linkTooLong')),
    )

const useStyles = makeStyles(() =>
    createStyles({
        spacer: {
            marginTop: '2em',
        },
    }),
)
const MAX_LINKS = 10

interface OwnProps {
    links: Nil<string[]>
}

export type LinkInputProps = OwnProps & Partial<InputProps>

const LinkInput = ({ links, ...props }: LinkInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <FieldArray
            name={'links'}
            render={(arrayHelpers) => (
                <div>
                    {links
                        ? links.map((link: string, index: number) => (
                              <StyledInput
                                  key={index}
                                  name={`links[${index}]`}
                                  label={index === 0 ? t('ideaProposalDetails.links') : ''}
                                  placeholder={t('ideaProposalDetails.form.linkPlaceholder')}
                                  {...props}
                              />
                          ))
                        : null}
                    <Button
                        className={classes.spacer}
                        variant={'text'}
                        color="primary"
                        disabled={links ? links.length >= MAX_LINKS : false}
                        type="button"
                        onClick={() => arrayHelpers.push('')}
                    >
                        {t('ideaProposalDetails.form.addLink')}
                    </Button>
                </div>
            )}
        />
    )
}

export default LinkInput
