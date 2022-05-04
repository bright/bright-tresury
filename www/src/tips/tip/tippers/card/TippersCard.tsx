import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Card from '../../../../components/card/Card'
import { breakpoints } from '../../../../theme/theme'
import { TipDto, TippingDto } from '../../../tips.dto'
import { useTippers } from '../useTippers'
import PendingTippers from './PendingTippers'
import TippersCardHeader from './TippersCardHeader'
import Tipping from './tipping/Tipping'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            padding: '20px 16px',
        },
    }),
)

interface OwnProps {
    tip: Omit<TipDto, 'tips'> & { tips: TippingDto[] }
}

export type TippersCardProps = OwnProps

const TippersCard = ({ tip }: TippersCardProps) => {
    const classes = useStyles()
    const { tippers, closingThreshold } = useTippers()

    return (
        <Card className={classes.root}>
            {closingThreshold ? <TippersCardHeader tip={tip} closingThreshold={closingThreshold} /> : null}
            {tip.tips.map((tipping) => (
                <Tipping key={tipping.tipper.web3address} tipping={tipping} />
            ))}
            {tippers && tippers.length > 0 ? <PendingTippers tip={tip} tippers={tippers} /> : null}
        </Card>
    )
}
export default TippersCard
