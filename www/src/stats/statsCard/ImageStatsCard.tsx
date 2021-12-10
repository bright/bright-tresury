import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { useCardStyles } from '../../components/card/cardStyles'
import LinkCard from '../../components/card/LinkCard'
import ContentContainer from './ContentContainer'
import InfoContainer from './InfoContainer'

const useStyles = makeStyles((theme) =>
    createStyles({
        content: {
            padding: '12px 36px 12px 15px',
            justifyContent: 'space-between',
        },
        image: {
            width: '142px',
        },
        info: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        name: {
            textAlign: `right`,
            color: theme.palette.text.disabled,
            fontSize: '18px',
        },
        value: {
            fontWeight: 'bold',
            fontSize: '30px',
            color: theme.palette.text.primary,
        },
    }),
)

interface OwnProps {
    value: number
    name: string
    imgSrc: string
    redirectTo: string
}

export type ImageStatsCardProps = OwnProps

const ImageStatsCard = ({ value, name, imgSrc, redirectTo }: ImageStatsCardProps) => {
    const classes = useStyles()
    const cardClasses = useCardStyles()

    return (
        <LinkCard redirectTo={redirectTo} className={cardClasses.transformOnHover}>
            <ContentContainer className={classes.content}>
                <img src={imgSrc} alt={''} className={classes.image} />
                <InfoContainer className={classes.info}>
                    <div className={classes.value}>{value}</div>
                    <div className={classes.name}>{name}</div>
                </InfoContainer>
            </ContentContainer>
        </LinkCard>
    )
}

export default ImageStatsCard
