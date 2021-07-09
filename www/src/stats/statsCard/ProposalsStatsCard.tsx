import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import ContentContainer from './ContentContainer'
import InfoContainer from './InfoContainer'

const useStyles = makeStyles((theme) =>
    createStyles({
        proposalsStatsCardRoot: {
            justifyContent: 'space-around',
        },
        drawing: {
            width: '142px',
        },
        proposalsStatsCardInfo: {
            width: '80px',
            alignItems: 'flex-end',
            paddingRight: '15px',
        },
        name: {
            textAlign: `right`,
            color: theme.palette.text.disabled,
            fontSize: '18px',
            marginTop: '5px',
        },
        textInfo: {
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
}

export type ProposalsStatsCardProps = OwnProps

const ProposalsStatsCard = ({ value, name, imgSrc }: ProposalsStatsCardProps) => {
    const classes = useStyles()

    return (
        <ContentContainer className={classes.proposalsStatsCardRoot}>
            <img className={classes.drawing} src={imgSrc} alt={''} />
            <InfoContainer className={classes.proposalsStatsCardInfo}>
                <div className={classes.textInfo}>{value}</div>
                <div className={classes.name}>{name}</div>
            </InfoContainer>
        </ContentContainer>
    )
}

export default ProposalsStatsCard
