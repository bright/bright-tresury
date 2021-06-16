import { createStyles, Theme } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/Button'
import { breakpoints } from '../../theme/theme'
import TransactionModal from './TransactionModal'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        linearProgressContainer: {
            padding: '2.5em 6em',
            [theme.breakpoints.up(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        linearProgress: {
            minWidth: '170px',
        },
    }),
)

interface OwnProps {
    onOk: () => void
}

export type SubstrateLoadingProps = OwnProps

const SubstrateLoading = ({ onOk }: SubstrateLoadingProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    return (
        <TransactionModal
            title={t('substrate.loading.title')}
            buttons={
                <Button color="primary" variant="text" onClick={onOk}>
                    {t('substrate.loading.cancel')}
                </Button>
            }
        >
            <div className={classes.linearProgressContainer}>
                <LinearProgress className={classes.linearProgress} color="primary" />
            </div>
        </TransactionModal>
    )
}

export default SubstrateLoading
