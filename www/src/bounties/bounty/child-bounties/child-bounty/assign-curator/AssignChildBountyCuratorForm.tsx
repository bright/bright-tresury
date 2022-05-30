import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useNetworks } from '../../../../../networks/useNetworks'
import { useTranslation } from 'react-i18next'
import NetworkValueInput from '../../../../../components/form/input/networkValue/NetworkValueInput'
import StyledSmallInput from '../../../../../components/form/input/StyledSmallInput'
import { ChildBountyDto } from '../../child-bounties.dto'
import FormFooter from '../../../../../components/form/footer/FormFooter'
import AssignChildBountyCuratorModal from './AssignChildBountyCuratorModal'
import { useModal } from '../../../../../components/modal/useModal'
import { useAssignChildBountyCurator } from './useAssignChildBountyCurator'

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
    parentBountyBlockchainIndex: number
    blockchainIndex: number
}

export type AssignChildBountyCuratorFormProps = PropsWithChildren<OwnProps>

const AssignChildBountyCuratorForm = ({
    blockchainIndex,
    parentBountyBlockchainIndex,
    children,
}: AssignChildBountyCuratorFormProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    const { t } = useTranslation()
    const submitModal = useModal()
    const { validationSchema, initialValues, toAssignChildBountyCuratorParams } = useAssignChildBountyCurator({
        blockchainIndex,
        parentBountyBlockchainIndex,
    })

    const onSubmit = () => {
        submitModal.open()
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={false}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <StyledSmallInput
                            name="curator"
                            description={t('form.web3AddressInput.description')}
                            placeholder={t('childBounty.assignCurator.form.curatorPlaceholder')}
                            label={t('childBounty.assignCurator.form.curator')}
                            variant={'web3Address'}
                        />
                        <NetworkValueInput
                            readonly={false}
                            inputName={'fee'}
                            label={t('childBounty.assignCurator.form.fee')}
                            networkId={network.id}
                        />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <AssignChildBountyCuratorModal
                        open={submitModal.visible}
                        onClose={submitModal.close}
                        assignChildBountyCuratorParams={toAssignChildBountyCuratorParams(values)}
                    />
                </>
            )}
        </Formik>
    )
}

export default AssignChildBountyCuratorForm
