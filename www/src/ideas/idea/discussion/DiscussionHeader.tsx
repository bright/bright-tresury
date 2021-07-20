import React, { PropsWithChildren } from 'react'
import Link from '../../../components/link/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        topRow: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        copyLinkSection: {
            display: 'flex',
            justifyContent: 'spaceBetween',
            flexGrow: 2,
        },
        link: {
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.palette.text.primary,
            padding: '4px 8px',
        },
        whiteBackground: {
            backgroundColor: '#FFFFFF',
            border: '0px solid #FFFFFF',
            borderRadius: '8px',
        },
        divider: {
            fontWeight: 600,
        },
    }),
)
interface OwnProps {}
export type DiscussionTopRowProps = OwnProps

const DiscussionHeader = ({}: DiscussionTopRowProps) => {
    const styles = useStyles()
    return (
        <div className={styles.topRow}>
            <div className={styles.copyLinkSection}>
                <Link className={`${styles.link} ${styles.whiteBackground}`}>
                    http://localhost:3000/ideas/5f88079b-b412-48ed-9b2c-9443496c3c91/discussion
                </Link>
                <Link className={styles.link}>copy link</Link>
            </div>

            <div>
                Comment also on
                <Link className={styles.link}>Polkassembly</Link>
                <span className={styles.divider}>|</span>
                <Link className={styles.link}>Element</Link>
            </div>
        </div>
    )
}

export default DiscussionHeader
