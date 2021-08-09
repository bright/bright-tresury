import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/button/Button'
import InformationTip from '../../../components/info/InformationTip'
import { ClassNameProps } from '../../../components/props/className.props'
import { Network } from '../../../networks/networks.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignSelf: 'flex-start',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        button: {
            marginRight: '18px',
        },
    }),
)

interface OwnProps {
    availableNetworks: Network[]
    onClick: () => void
}

export type AddNetworkButtonProps = OwnProps & ClassNameProps

const AddNetworkButton = ({ availableNetworks, onClick, className }: AddNetworkButtonProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={clsx(classes.root, className)}>
            <Button
                className={classes.button}
                variant={'text'}
                color={'primary'}
                onClick={onClick}
                disabled={availableNetworks.length === 0}
            >
                {t('idea.details.form.networks.additionalNet')}
            </Button>
            {availableNetworks.length === 0 ? (
                <InformationTip label={t('idea.details.form.networks.allNetsAdded')} />
            ) : null}
        </div>
    )
}

export default AddNetworkButton
