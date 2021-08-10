import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../components/text/Label'
import Identicon from '../components/identicon/Identicon'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Link from '../components/link/Link'
import { breakpoints } from '../theme/theme'
import Placeholder from '../components/text/Placeholder'
import { IdeaProposalDetailsDto } from './idea-proposal-details.dto'
import LongText from './LongText'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px',
            },
        },
        spacing: {
            marginTop: '2em',
        },
        beneficiary: {
            display: 'flex',
            alignItems: 'center',
        },
        accountValue: {
            marginLeft: '.5em',
        },
        linkSpacing: {
            marginTop: '.7em',
        },
        link: {
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.palette.text.primary,
        },
    }),
)

interface OwnProps {
    beneficiary: string
    details?: IdeaProposalDetailsDto
}

export type IdeaProposalDetailsProps = OwnProps

const IdeaProposalDetails = ({ beneficiary, details }: IdeaProposalDetailsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const nonEmptyLinks = useMemo(() => (details?.links ? details.links.filter((link: string) => !!link) : []), [
        details,
    ])

    return (
        <div>
            <Label label={t('idea.details.beneficiary')} />
            <div className={classes.beneficiary}>
                {beneficiary ? (
                    <>
                        <Identicon address={beneficiary} />
                        <div className={clsx(classes.accountValue, classes.text)}>{beneficiary}</div>
                    </>
                ) : (
                    <Placeholder value={t('idea.details.beneficiary')} />
                )}
            </div>
            <div className={classes.spacing}>
                <Label label={t('idea.details.field')} />
                <text className={classes.text}>
                    {details?.field || <Placeholder value={t('idea.details.field')} />}
                </text>
            </div>
            <div className={classes.spacing}>
                <Label label={t('idea.details.content')} />
                <LongText text={details?.content} placeholder={t('idea.details.content')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('idea.details.contact')} />
                <LongText text={details?.contact} placeholder={t('idea.details.contact')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('idea.details.portfolio')} />
                <LongText text={details?.portfolio} placeholder={t('idea.details.portfolio')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('idea.details.links')} />
                {nonEmptyLinks.length > 0 ? (
                    nonEmptyLinks.map((link: string, index: number) => (
                        <div className={index !== 0 ? classes.linkSpacing : ''}>
                            <Link className={classes.link} href={link} key={index}>
                                {link}
                            </Link>
                        </div>
                    ))
                ) : (
                    <Placeholder value={t('idea.details.links')} />
                )}
            </div>
        </div>
    )
}

export default IdeaProposalDetails
