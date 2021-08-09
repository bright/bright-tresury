import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { Network } from '../../networks/networks.dto'
import { useNetworks } from '../../networks/useNetworks'
import Card from '../card/Card'
import { useCardStyles } from '../card/cardStyles'
import LinkCard from '../card/LinkCard'

const useStyles = ({ color }: { color: string }) =>
    makeStyles(() =>
        createStyles({
            networkAccentLine: {
                backgroundColor: color,
                height: '100%',
                width: '4px',
                position: 'absolute',
            },
        }),
    )

interface OwnProps {
    redirectTo?: string
    cardNetwork?: Network
}

export type NetworkCardProps = PropsWithChildren<OwnProps & HTMLAttributes<HTMLDivElement>>
const NetworkCard = ({ children, redirectTo, cardNetwork, ...props }: NetworkCardProps) => {
    const { network: contextNetwork } = useNetworks()

    const color = cardNetwork?.color ?? contextNetwork.color

    const classes = useStyles({ color })()
    const cardClasses = useCardStyles()

    const cardContent = (
        <>
            <div className={classes.networkAccentLine} />
            <div className={cardClasses.content}>{children}</div>
        </>
    )

    return (
        <>
            {redirectTo ? (
                <LinkCard {...props} redirectTo={redirectTo} className={cardClasses.transformOnHover}>
                    {cardContent}
                </LinkCard>
            ) : (
                <Card {...props}>{cardContent}</Card>
            )}
        </>
    )
}
export default NetworkCard
