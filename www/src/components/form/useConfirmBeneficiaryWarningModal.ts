import { encodeAddress } from '@polkadot/util-crypto'
import { useModal, UseModalResult } from '../modal/useModal'

interface WithBeneficiary {
    beneficiary: string
}

interface OwnProps<TFormValues extends WithBeneficiary> {
    initialValues: TFormValues
    submit: (formValues: TFormValues) => void
}

export type UseConfirmBeneficiaryWarningModalProps<TFormValues extends WithBeneficiary> = OwnProps<TFormValues>

export type UseConfirmBeneficiaryWarningModalResult<TFormValues extends WithBeneficiary> = {
    onFormSubmit: (formValues: TFormValues) => void
    handleModalSubmit: (formValues: TFormValues) => void
} & UseModalResult

export const useConfirmBeneficiaryWarningModal = <TFormValues extends WithBeneficiary>({
    initialValues,
    submit,
}: UseConfirmBeneficiaryWarningModalProps<TFormValues>): UseConfirmBeneficiaryWarningModalResult<TFormValues> => {
    const { close, open, visible } = useModal(false)

    const onFormSubmit = (formValues: TFormValues) => {
        if (
            formValues.beneficiary !== '' &&
            (!initialValues?.beneficiary ||
                encodeAddress(initialValues.beneficiary) !== encodeAddress(formValues.beneficiary))
        ) {
            open()
        } else {
            submit(formValues)
        }
    }

    const handleModalSubmit = (formValues: TFormValues) => {
        close()
        submit(formValues)
    }

    return { visible, open, close, onFormSubmit, handleModalSubmit }
}
