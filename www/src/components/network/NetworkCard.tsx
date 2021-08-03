import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCardStyles } from '../card/cardStyles'
import LinkCard from '../card/LinkCard'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        networkAccentLine: {
            backgroundColor: theme.palette.network.main,
            height: '100%',
            width: '4px',
            position: 'absolute',
        },
    }),
)

interface OwnProps {
    redirectTo: string
}
export type NetworkCardProps = PropsWithChildren<OwnProps & HTMLAttributes<HTMLDivElement>>
const NetworkCard = ({ children, redirectTo, ...props }: NetworkCardProps) => {
    const classes = useStyles()
    const cardClasses = useCardStyles()

    return (
        <>
            <LinkCard {...props} redirectTo={redirectTo}>
                <div className={classes.networkAccentLine} />
                <div className={cardClasses.content}>{children}</div>
            </LinkCard>
        </>
    )
}
export default NetworkCard
