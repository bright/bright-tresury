import Link from '../../components/link/Link'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        icon: {
            width: '28px',
            margin: '3px 6px',
            filter: 'grayscale(1) opacity(0.66)',
            '&:hover': {
                filter: 'grayscale(0) opacity(1)',
            },
        },
    }),
)

interface OwnProps {
    url: string
    src: string
}

export type ExternalImgLinkProps = OwnProps

const ExternalImgLink = ({ url, src }: ExternalImgLinkProps) => {
    const classes = useStyles()
    return (
        <Link href={url} target={'_blank'}>
            <img className={classes.icon} src={src} />
        </Link>
    )
}
export default ExternalImgLink
