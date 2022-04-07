import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import FormFooter from '../../components/form/footer/FormFooter'
import { networkValueValidationSchema, optional } from '../../components/form/input/networkValue/NetworkValueInput'
import { useModal } from '../../components/modal/useModal'
import { useNetworks } from '../../networks/useNetworks'
import { isValidAddressOrEmpty } from '../../util/addressValidator'
import { isMin, toNetworkDisplayValue } from '../../util/quota.util'
import { getBytesLength } from '../../util/stringUtil'
import { NetworkDisplayValue, NetworkPlanckValue } from '../../util/types'
import SubmitTipModal from './SubmitTipModal'
import TipCreateFormFields from './TipCreateFormFields'
import { useTipCreate } from './useTipCreate'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {}

export type TipCreateFormProps = PropsWithChildren<OwnProps>

const TipCreateForm = ({ children }: TipCreateFormProps) => {
    const classes = useStyles()
    const submitTipModal = useModal()
    const { initialValues, validationSchema } = useTipCreate()

    const onSubmit = () => {
        submitTipModal.open()
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
                        <TipCreateFormFields />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <SubmitTipModal open={submitTipModal.visible} onClose={submitTipModal.close} tip={values} />
                </>
            )}
        </Formik>
    )
}

export default TipCreateForm
