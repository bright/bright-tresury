import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import FormFooter from '../../../components/form/footer/FormFooter'
import { useNetworks } from '../../../networks/useNetworks'
import { isValidAddressOrEmpty } from '../../../util/addressValidator'
import { BountyDto } from '../../bounties.dto'
import BountyEditFormFields from './BountyEditFormFields'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface BountyEditFormValues {
    blockchainIndex: number
    title: string
    field: string
    description: string
    beneficiary: string
}

interface OwnProps {
    bounty: BountyDto
    onSubmit: (formValues: BountyEditFormValues) => Promise<void>
}

export type BountyEditFormProps = PropsWithChildren<OwnProps>

const BountyEditForm = ({ bounty, onSubmit, children }: BountyEditFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('bounty.form.emptyFieldError')),
        beneficiary: Yup.string().test('validate-address', t('bounty.form.wrongBeneficiaryError'), (address) => {
            return isValidAddressOrEmpty(address, network.ss58Format)
        }),
    })

    const initialValues: BountyEditFormValues = {
        blockchainIndex: bounty.blockchainIndex,
        title: bounty.title ?? '',
        field: bounty.field ?? '',
        description: bounty.description ?? '',
        beneficiary: bounty.beneficiary?.address ?? '',
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BountyEditFormFields bounty={bounty} />
                        <FormFooter>{children}</FormFooter>
                    </form>
                </>
            )}
        </Formik>
    )
}

export default BountyEditForm
