import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FieldArray } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/Button'
import Input from '../../components/form/input/Input'
import FormSelect from '../../components/select/FormSelect'
import { breakpoints } from '../../theme/theme'
import { IdeaFormValues } from './IdeaForm'
import NetworksInput from './networks/NetworksInput'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        inputField: {
            marginTop: '2em',
        },
        smallField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        fieldSelect: {
            backgroundColor: theme.palette.background.default,
            fontWeight: 500,
        },
    }),
)
const MAX_LINKS = 10

interface OwnProps {
    values: IdeaFormValues
}

export type IdeaFormFieldsProps = OwnProps

const IdeaFormFields = ({ values }: IdeaFormFieldsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <>
            <div className={classes.inputField}>
                <Input name="title" placeholder={t('idea.details.title')} label={t('idea.details.title')} />
            </div>
            <div className={`${classes.inputField} ${classes.smallField}`}>
                <Input
                    name="beneficiary"
                    placeholder={t('idea.details.beneficiary')}
                    label={t('idea.details.beneficiary')}
                />
            </div>
            <NetworksInput currentNetwork={values.currentNetwork} otherNetworks={values.otherNetworks} />
            <div className={`${classes.inputField} ${classes.smallField}`}>
                <FormSelect
                    className={classes.fieldSelect}
                    name="field"
                    label={t('idea.details.field')}
                    placeholder={t('idea.details.field')}
                    options={['Optimisation', 'Treasury', 'Transactions']}
                    value={values.field}
                />
            </div>
            <div className={classes.inputField}>
                <Input
                    name="content"
                    multiline={true}
                    rows={8}
                    label={t('idea.details.content')}
                    placeholder={t('idea.details.content')}
                />
            </div>

            <div className={classes.inputField}>
                <Input
                    name="contact"
                    multiline={true}
                    rows={4}
                    label={t('idea.details.contact')}
                    placeholder={t('idea.details.contact')}
                />
            </div>
            <div className={classes.inputField}>
                <Input
                    name="portfolio"
                    multiline={true}
                    rows={4}
                    label={t('idea.details.portfolio')}
                    placeholder={t('idea.details.portfolio')}
                />
            </div>
            <div className={classes.inputField}>
                <FieldArray
                    name={'links'}
                    render={(arrayHelpers) => (
                        <div>
                            {values.links
                                ? values.links.map((link: string, index: number) => (
                                      <div className={classes.inputField} key={index}>
                                          <Input
                                              name={`links[${index}]`}
                                              label={index === 0 ? t('idea.details.links') : ''}
                                              placeholder={t('idea.details.form.linkPlaceholder')}
                                          />
                                      </div>
                                  ))
                                : null}
                            <Button
                                className={classes.inputField}
                                variant={'text'}
                                color="primary"
                                disabled={values.links ? values.links.length >= MAX_LINKS : false}
                                type="button"
                                onClick={() => arrayHelpers.push('')}
                            >
                                {t('idea.details.form.addLink')}
                            </Button>
                        </div>
                    )}
                />
            </div>
        </>
    )
}

export default IdeaFormFields
