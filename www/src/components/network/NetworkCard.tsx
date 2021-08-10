import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { Network } from '../../networks/networks.dto'
import { useNetworks } from '../../networks/useNetworks'
import Card from '../card/Card'
import { useCardStyles } from '../card/cardStyles'
import LinkCard from '../card/LinkCard'

const useStyles = ({ colors }: { colors: string[] }) =>
    makeStyles(() => {
        const percentage = Math.ceil(100 / colors.length)
        const gradientColors = colors
            .map((c, index) => `${c} ${index * percentage}% ${(index + 1) * percentage}%`)
            .join(', ')
        let background =
            colors.length === 1
                ? { backgroundColor: colors[0] }
                : { backgroundImage: `linear-gradient(${gradientColors})` }
        return createStyles({
            networkAccentLine: {
                height: '100%',
                width: '4px',
                position: 'absolute',
                ...background,
            },
        })
    })

interface OwnProps {
    redirectTo?: string
    networks?: Network[]
}

export type NetworkCardProps = PropsWithChildren<OwnProps & HTMLAttributes<HTMLDivElement>>
const NetworkCard = ({ children, redirectTo, networks, ...props }: NetworkCardProps) => {
    const { network: contextNetwork } = useNetworks()

    const colors = networks?.map((n) => n.color) ?? [contextNetwork.color]

    const classes = useStyles({ colors })()
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
