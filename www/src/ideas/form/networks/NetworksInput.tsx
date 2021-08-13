import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { EditIdeaNetworkDto } from '../../ideas.dto'
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
    currentNetwork: EditIdeaNetworkDto
    otherNetworks: EditIdeaNetworkDto[]
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
