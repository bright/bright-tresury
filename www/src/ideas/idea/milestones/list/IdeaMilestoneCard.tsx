import React from "react";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {breakpoints} from "../../../../theme/theme";
import {Divider} from "../../../../components/divider/Divider";
import {IdeaMilestoneOrdinalNumber} from "./IdeaMilestoneOrdinalNumber";
import {NetworkCardTitle} from "../../../../components/network/NetworkCardTitle";
import {NetworkValue} from "../../../../components/network/NetworkValue";
import {IdeaMilestoneDescription} from "./IdeaMilestoneDescription";
import {IdeaMilestoneDateRange} from "./IdeaMilestoneDateRange";
import {Card} from "../../../../components/card/Card";

const useStyles = makeStyles((theme: Theme) => createStyles({
    cardContent: {
        margin: '0 20px 0 24px',
        cursor: 'pointer'
    },
    header: {
        marginTop: '20px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    details: {
        padding: '0',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        [theme.breakpoints.down(breakpoints.mobile)]: {
            flexDirection: 'column-reverse',
            alignItems: 'flex-start'
        },
    },
    description: {
        height: '50px',
        marginBottom: '20px',
    }
}))

interface Props {
    ideaMilestone: IdeaMilestoneDto
    onClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export const IdeaMilestoneCard = ({ ideaMilestone, onClick }: Props) => {

    const classes = useStyles()

    return (
        <Card onClick={() => onClick(ideaMilestone)}>
            <div className={classes.cardContent}>

                <div className={classes.header}>
                    <IdeaMilestoneOrdinalNumber ordinalNumber={ideaMilestone.ordinalNumber} />
                    <IdeaMilestoneDateRange dateFrom={ideaMilestone.dateFrom} dateTo={ideaMilestone.dateTo} />
                </div>

                <Divider />

                <div className={classes.details}>
                    <NetworkCardTitle title={ideaMilestone.subject} />
                    { ideaMilestone.networks && ideaMilestone.networks.length > 0
                        ? <NetworkValue value={ideaMilestone.networks[0].value} />
                        : null
                    }
                </div>

                <div className={classes.description}>
                    <IdeaMilestoneDescription description={ideaMilestone.description} />
                </div>

            </div>
        </Card>
    )
}
