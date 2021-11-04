import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import AdditionalNetworks from './AdditionalNetworks'
import { IdeaNetworkFromValues } from '../useIdeaForm'
import IdeaNetworkValueInput from './IdeaNetworkValueInput'

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
            <IdeaNetworkValueInput
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
