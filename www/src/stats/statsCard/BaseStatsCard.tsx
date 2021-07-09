import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import InfoContainer from './InfoContainer'
import ContentContainer from './ContentContainer'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
        },
        drawing: {
            width: '25px',
            marginBottom: '10px',
        },
        info: {
            alignItems: 'center',
        },
        name: {
            textAlign: `right`,
            color: theme.palette.text.disabled,
            fontSize: '18px',
        },
        value: {
            display: 'flex',
            alignItems: 'flex-end',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '30px',
            color: theme.palette.text.primary,
        },
    }),
)

interface OwnProps {
    value: string
    name: string
    imgSrc: string
}

export type BaseStatsCardProps = OwnProps

const BaseStatsCard = ({ value, name, imgSrc }: BaseStatsCardProps) => {
    const classes = useStyles()

    return (
        <ContentContainer className={classes.root}>
            <img className={classes.drawing} src={imgSrc} alt={''} />
            <InfoContainer className={classes.info}>
                <div className={classes.value}>{value}</div>
                <div className={classes.name}>{name}</div>
            </InfoContainer>
        </ContentContainer>
    )
}

export default BaseStatsCard
