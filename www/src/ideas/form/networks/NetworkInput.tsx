import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/form/input/Input'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import { breakpoints } from '../../../theme/theme'
import { IdeaNetworkDto } from '../../ideas.dto'
import Bond from './Bond'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
            },
        },
        bond: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '2em',
            },
        },
        value: {
            width: '240px',
            marginRight: '55px',
        },
    }),
)

interface OwnProps {
    inputName: string
    ideaNetwork: IdeaNetworkDto
}

export type NetworkInputProps = OwnProps & ClassNameProps

const NetworkInput = ({ inputName, ideaNetwork, className }: NetworkInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const selectedNetwork = networks.find((n) => n.id === ideaNetwork.name)!

    return (
        <div className={clsx(classes.root, className)}>
            <Input
                className={classes.value}
                name={inputName}
                type={`number`}
                label={t('idea.details.form.networks.reward')}
                placeholder={t('idea.details.form.networks.reward')}
                endAdornment={selectedNetwork.currency}
            />
            <Bond className={classes.bond} ideaNetwork={ideaNetwork} />
        </div>
    )
}

export default NetworkInput
