import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import FormFooter from '../../components/form/footer/FormFooter'
import { useModal } from '../../components/modal/useModal'
import TipCreateAndTipFormFields from './create-and-tip/TipCreateAndTipFormFields'
import SubmitTipModal from './SubmitTipModal'
import { useTipCreate } from './useTipCreate'
import TipCreateOnlyFormFields from './create-only/TipCreateOnlyFormFields'
import { TipCreateMode } from './TipCreateSwitch'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    mode: TipCreateMode
}

export type TipCreateFormProps = PropsWithChildren<OwnProps>

const TipCreateForm = ({ mode, children }: TipCreateFormProps) => {
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
                        {mode === 'createOnly' ? (
                            <TipCreateOnlyFormFields values={values} />
                        ) : (
                            <TipCreateAndTipFormFields />
                        )}
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <SubmitTipModal
                        open={submitTipModal.visible}
                        onClose={submitTipModal.close}
                        tip={values}
                        mode={mode}
                    />
                </>
            )}
        </Formik>
    )
}

export default TipCreateForm
