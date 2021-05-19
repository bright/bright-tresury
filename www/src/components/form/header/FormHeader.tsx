import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useHistory } from 'react-router-dom'
import crossSvg from '../../../assets/cross.svg'
import { IconButton } from '../../button/IconButton'
import { Header } from '../../text/Header'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
        },
    }),
)

export interface FormHeaderProps {
    title: string
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title }) => {
    const classes = useStyles()
    const history = useHistory()

    const goBack = () => {
        history.goBack()
    }

    return (
        <div className={classes.headerContainer}>
            <Header>{title}</Header>
            <IconButton svg={crossSvg} onClick={goBack} />
        </div>
    )
}
