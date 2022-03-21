import Balances from './components/Balances'
import ExternalLinks from './components/ExternalLinks'
import Identity from './components/Identity'
import AccountDetailsHeader from './components/AccountDetailsHeader'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '15px',
            width: '350px',
        },
    }),
)

interface OwnProps {
    address: string
}

export type AccountDetailsProps = OwnProps

const AccountDetails = ({ address }: AccountDetailsProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AccountDetailsHeader address={address} />
            <hr />
            <Identity address={address} />
            <hr />
            <Balances address={address} />
            <hr />
            <ExternalLinks address={address} />
        </div>
    )
}
export default AccountDetails
