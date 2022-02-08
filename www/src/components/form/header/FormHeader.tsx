import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTE_ROOT } from '../../../routes/routes'
import CloseButton from '../../closeIcon/CloseButton'
import { Header } from '../../text/Header'
import CloseFormWarningModal from '../CloseFormWarningModal'
import { useModal } from '../../modal/useModal'

const useStyles = makeStyles(() =>
    createStyles({
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    }),
)

export interface FormHeaderProps {
    title: string
    showWarningOnClose?: boolean
}

const FormHeader = ({ title, showWarningOnClose = false }: FormHeaderProps) => {
    const classes = useStyles()
    const history = useHistory()
    const warningModal = useModal()

    const goBack = () => {
        if (history.length > 1) {
            history.goBack()
        } else {
            history.replace(ROUTE_ROOT)
        }
    }

    const handleCloseButtonClick = () => {
        if (showWarningOnClose) {
            warningModal.open()
        } else {
            goBack()
        }
    }

    return (
        <div className={classes.headerContainer}>
            <Header>{title}</Header>
            <CloseButton onClose={handleCloseButtonClick} />
            {showWarningOnClose && (
                <CloseFormWarningModal
                    open={warningModal.visible}
                    onClose={warningModal.close}
                    handleFormClose={goBack}
                />
            )}
        </div>
    )
}

export default FormHeader
