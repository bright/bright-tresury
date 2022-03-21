import useBalances from '../../util/useBalances'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import BalanceEntry from './BalanceEntry'
import TotalBalanceEntry from './TotalBalanceEntry'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            fontSize: '12px',
            color: theme.palette.text.disabled,
            textTransform: 'uppercase',
        },
    }),
)

interface OwnProps {
    address: string
}

export type BalancesProps = OwnProps

const Balances = ({ address }: BalancesProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { balances } = useBalances({ address })
    return (
        <>
            <p className={classes.header}>{t('components.balances.balance')}</p>
            <TotalBalanceEntry title={t('components.balances.total')} amount={balances.total} />
            <BalanceEntry title={t('components.balances.transferable')} amount={balances.transferable} />
            <BalanceEntry title={t('components.balances.locked')} amount={balances.locked} />
            <BalanceEntry title={t('components.balances.reserved')} amount={balances.reserved} />
        </>
    )
}
export default Balances
