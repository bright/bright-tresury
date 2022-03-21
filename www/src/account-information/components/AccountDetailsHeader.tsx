import Identicon from '../../components/identicon/Identicon'
import useIdentity from '../../util/useIdentity'
import { useNetworks } from '../../networks/useNetworks'
import { encodeAddress } from '@polkadot/keyring'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        right: {
            marginLeft: '5px',
        },
        displayName: {
            margin: 0,
            fontWeight: theme.typography.h2.fontWeight,
            fontSize: theme.typography.h2.fontSize,
        },
        address: {
            margin: 0,
            marginTop: '5px',
            fontSize: '14px',
            wordBreak: 'break-word',
        },
    }),
)

interface OwnProps {
    address: string
}
export type AccountDetailsHeaderProps = OwnProps

const AccountDetailsHeader = ({ address }: AccountDetailsHeaderProps) => {
    const { identity } = useIdentity({ address })
    const { network } = useNetworks()
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Identicon address={address} size={55} />
            <div className={classes.right}>
                <p className={classes.displayName}>{identity?.display ?? ''}</p>
                <p className={classes.address}>{encodeAddress(address, network.ss58Format)}</p>
            </div>
        </div>
    )
}
export default AccountDetailsHeader
