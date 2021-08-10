import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useNetworks } from '../../../networks/useNetworks'
import { IdeaNetworkDto } from '../../ideas.dto'
import AdditionalNetworks from './AdditionalNetworks'
import NetworkInput from './NetworkInput'

const useStyles = makeStyles(() =>
    createStyles({
        inputField: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    currentNetwork: IdeaNetworkDto
    otherNetworks: IdeaNetworkDto[]
}

export type NetworksInputProps = OwnProps

const NetworksInput = ({ currentNetwork, otherNetworks }: NetworksInputProps) => {
    const classes = useStyles()

    return (
        <>
            <NetworkInput
                className={classes.inputField}
                inputName={'currentNetwork.value'}
                ideaNetwork={currentNetwork}
            />
            <AdditionalNetworks
                className={classes.inputField}
                currentNetwork={currentNetwork}
                otherNetworks={otherNetworks}
            />
        </>
    )
}

export default NetworksInput
