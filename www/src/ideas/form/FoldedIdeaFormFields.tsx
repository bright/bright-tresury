import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../components/form/input/Input'
import { useNetworks } from '../../networks/useNetworks'
import { breakpoints } from '../../theme/theme'
import { IdeaFormValues } from './IdeaForm'
import NetworkInput from './networks/NetworkInput'

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
    }),
)

interface OwnProps {
    values: IdeaFormValues
}

export type FoldedIdeaFormFieldsProps = OwnProps

const FoldedIdeaFormFields = ({ values }: FoldedIdeaFormFieldsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { network } = useNetworks()

    const ideaNetworkIndex = values.networks.findIndex((n) => n.name === network.id)

    if (ideaNetworkIndex < 0) {
        return <></>
    }

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
            <NetworkInput index={ideaNetworkIndex} ideaNetwork={values.networks[ideaNetworkIndex]} />
        </>
    )
}

export default FoldedIdeaFormFields
