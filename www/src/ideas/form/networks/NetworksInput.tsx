import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import AdditionalNetworks from './AdditionalNetworks'
import NetworkInput from './NetworkInput'
import { IdeaNetworkFromValues } from '../useIdeaForm'

const useStyles = makeStyles(() =>
    createStyles({
        inputField: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    currentNetwork: IdeaNetworkFromValues
    additionalNetworks: IdeaNetworkFromValues[]
}

export type NetworksInputProps = OwnProps

const NetworksInput = ({ currentNetwork, additionalNetworks }: NetworksInputProps) => {
    const classes = useStyles()

    return (
        <>
            <NetworkInput
                className={classes.inputField}
                inputName={'currentNetwork.value'}
                networkId={currentNetwork.name}
                value={currentNetwork.value}
            />
            <AdditionalNetworks
                className={classes.inputField}
                currentNetwork={currentNetwork}
                additionalNetworks={additionalNetworks}
            />
        </>
    )
}

export default NetworksInput
