import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import FormFooter from '../../../../components/form/footer/FormFooter'
import {
    networkValueValidationSchema,
    optional,
} from '../../../../components/form/input/networkValue/NetworkValueInput'
import { useModal } from '../../../../components/modal/useModal'
import { useNetworks } from '../../../../networks/useNetworks'
import { isMin, toNetworkDisplayValue } from '../../../../util/quota.util'
import { getBytesLength } from '../../../../util/stringUtil'
import { NetworkDisplayValue, NetworkPlanckValue } from '../../../../util/types'
import SubmitChildBountyModal from './SubmitChildBountyModal'
import ChildBountyCreateFormFields from './ChildBountyCreateFormFields'
import { BountyDto } from '../../../bounties.dto'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface ChildBountyCreateFormValues {
    parentBountyId: number
    blockchainDescription: string
    value: NetworkDisplayValue
    title: string
    description: string
}

interface OwnProps {
    bounty: BountyDto
}

export type ChildBountyCreateFormProps = PropsWithChildren<OwnProps>

const ChildBountyCreateForm = ({ bounty, children }: ChildBountyCreateFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const submitModal = useModal()
    const { network, findNetwork } = useNetworks()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('childBounty.form.emptyFieldError')),
        blockchainDescription: Yup.string()
            .required(t('childBounty.form.emptyFieldError'))
            .test(
                'max-bytes-length',
                t('childBounty.form.maxBlockchainDescriptionLength'),
                optional((value) => getBytesLength(value) <= network.bounties.maximumReasonLength),
            ),
        value: networkValueValidationSchema({ t, findNetwork, required: true, decimals: network.decimals }).test(
            'is-min',
            t('childBounty.form.minValueError', {
                value: toNetworkDisplayValue(network.childBounties.childBountyValueMinimum, network.decimals),
            }),
            optional((value) => isMin(value, network.childBounties.childBountyValueMinimum, network.decimals)),
        ),
    })

    const initialValues: ChildBountyCreateFormValues = {
        parentBountyId: bounty.blockchainIndex,
        blockchainDescription: '',
        value: toNetworkDisplayValue('0' as NetworkPlanckValue, network.decimals),
        title: '',
        description: '',
    }

    const onSubmit = () => {
        submitModal.open()
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
                        <ChildBountyCreateFormFields />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <SubmitChildBountyModal
                        open={submitModal.visible}
                        onClose={submitModal.close}
                        childBounty={values}
                    />
                </>
            )}
        </Formik>
    )
}

export default ChildBountyCreateForm
