import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import FormFooter from '../../components/form/footer/FormFooter'
import { networkValueValidationSchema, optional } from '../../components/form/input/networkValue/NetworkValueInput'
import { useModal } from '../../components/modal/useModal'
import { useNetworks } from '../../networks/useNetworks'
import { isMin, toNetworkDisplayValue } from '../../util/quota.util'
import { getBytesLength } from '../../util/stringUtil'
import { NetworkDisplayValue, NetworkPlanckValue } from '../../util/types'
import SubmitBountyModal from './SubmitBountyModal'
import BountyCreateFormFields from './BountyCreateFormFields'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface BountyCreateFormValues {
    blockchainDescription: string
    value: NetworkDisplayValue
    title: string
    field: string
    description: string
}

interface OwnProps {}

export type BountyCreateFormProps = PropsWithChildren<OwnProps>

const BountyCreateForm = ({ children }: BountyCreateFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const submitBountyModal = useModal()
    const { network, findNetwork } = useNetworks()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('bounty.form.emptyFieldError')),
        blockchainDescription: Yup.string()
            .required(t('bounty.form.emptyFieldError'))
            .test(
                'max-bytes-length',
                t('bounty.form.maxBlockchainDescriptionLength'),
                optional((value) => getBytesLength(value) <= network.bounties.maximumReasonLength),
            ),
        value: networkValueValidationSchema({
            t,
            findNetwork,
            required: true,
            nonZero: true,
            decimals: network.decimals,
        }).test(
            'is-min',
            t('bounty.form.minValueError', {
                value: toNetworkDisplayValue(network.bounties.bountyValueMinimum, network.decimals),
            }),
            optional((value) => isMin(value, network.bounties.bountyValueMinimum, network.decimals)),
        ),
    })

    const initialValues: BountyCreateFormValues = {
        blockchainDescription: '',
        value: toNetworkDisplayValue('0' as NetworkPlanckValue, network.decimals),
        title: '',
        field: '',
        description: '',
    }

    const onSubmit = () => {
        submitBountyModal.open()
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
                        <BountyCreateFormFields formValues={values} />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <SubmitBountyModal
                        open={submitBountyModal.visible}
                        onClose={submitBountyModal.close}
                        bounty={values}
                    />
                </>
            )}
        </Formik>
    )
}

export default BountyCreateForm
