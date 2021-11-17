import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTE_ROOT } from '../../../routes/routes'
import CloseButton from '../../closeIcon/CloseButton'
import { Header } from '../../text/Header'

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
}

const FormHeader = ({ title }: FormHeaderProps) => {
    const classes = useStyles()
    const history = useHistory()

    const goBack = () => {
        if (history.length > 1) {
            history.goBack()
        } else {
            history.replace(ROUTE_ROOT)
        }
    }

    return (
        <div className={classes.headerContainer}>
            <Header>{title}</Header>
            <CloseButton onClose={goBack} />
        </div>
    )
}

export default FormHeader
