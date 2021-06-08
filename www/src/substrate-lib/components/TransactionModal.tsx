import { Box, createStyles } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { Info } from '../../components/info/Info'

const useStyles = makeStyles(
    createStyles({
        title: {
            textAlign: 'center',
        },
        subtitle: {
            textAlign: 'center',
        },
    }),
)

export interface Props {
    title?: string
    subtitle?: string | Element | JSX.Element
    instruction?: string | Element | JSX.Element
    imgSrc?: string
    buttons?: JSX.Element
}

const TransactionModal: React.FC<Props> = ({ title, subtitle, instruction, imgSrc, buttons, children }) => {
    const classes = useStyles()
    return (
        <Box display="flex" flexDirection="column" alignItems="center" height="100%">
            {imgSrc && <img src={imgSrc} alt={title || ''} />}
            {title && (
                <h2 className={classes.title} id="modal-title">
                    {title}
                </h2>
            )}
            {subtitle && (
                <p className={classes.subtitle} id="modal-description">
                    {subtitle}
                </p>
            )}
            {instruction && <Info>{instruction}</Info>}
            {children}
            {buttons && (
                <Box pt="20px" mt="auto">
                    {buttons}
                </Box>
            )}
        </Box>
    )
}

export default TransactionModal
