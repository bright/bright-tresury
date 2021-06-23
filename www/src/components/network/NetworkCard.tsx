import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '../card/Card'
import config from '../../config/index'
import LinkCard from '../card/LinkCard'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardContent: {
            margin: '0 20px 0 24px',
        },
        networkAccentLine: {
            backgroundColor: theme.palette.network.main,
            height: '100%',
            width: '4px',
            position: 'absolute',
        },
    }),
)

interface OwnProps {
    network?: string
    redirectTo?: string
}
export type NetworkCardProps = PropsWithChildren<OwnProps & HTMLAttributes<HTMLDivElement>>
const NetworkCard = ({ children, network = config.NETWORK_NAME, redirectTo, ...props }: NetworkCardProps) => {
    const classes = useStyles()

    const cardContent = (
        <>
            <div className={classes.networkAccentLine} />
            <div className={classes.cardContent}>{children}</div>
        </>
    )

    return (
        <>
            {redirectTo ? (
                <LinkCard {...props} redirectTo={redirectTo}>
                    {cardContent}
                </LinkCard>
            ) : (
                <Card {...props}>{cardContent}</Card>
            )}
        </>
    )
}
export default NetworkCard
