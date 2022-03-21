import dotscannerIconSrc from '../../assets/dotscanner.png'
import polkascanIconSrc from '../../assets/polkascan.png'
import polkastatsIconSrc from '../../assets/polkastats.png'
import subidIconSrc from '../../assets/subid.svg'
import subscanIconSrc from '../../assets/subscan.svg'

import { useNetworks } from '../../networks/useNetworks'
import ExternalImgLink from './ExternalImgLink'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
        },
    }),
)

interface OwnProps {
    address: string
}

type ExternalLinksProps = OwnProps

const ExternalLinks = ({ address }: ExternalLinksProps) => {
    const classes = useStyles()
    const { network } = useNetworks()

    return (
        <div className={classes.root}>
            <ExternalImgLink url={`https://dotscanner.com/${network.id}/account/${address}`} src={dotscannerIconSrc} />
            <ExternalImgLink url={`https://polkascan.io/${network.id}/account/${address}`} src={polkascanIconSrc} />
            <ExternalImgLink url={`https://${network.id}.polkastats.io/account/${address}`} src={polkastatsIconSrc} />
            <ExternalImgLink url={`https://sub.id/#/${address}`} src={subidIconSrc} />
            <ExternalImgLink url={`https://${network.id}.subscan.io/account/${address}`} src={subscanIconSrc} />
        </div>
    )
}
export default ExternalLinks
