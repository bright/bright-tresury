import React from "react";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {Divider} from "../../../../components/divider/Divider";
import {IdeaMilestoneOrdinalNumber} from "./IdeaMilestoneOrdinalNumber";
import {NetworkCardTitle} from "../../../../components/network/NetworkCardTitle";
import {NetworkValue} from "../../../../components/network/NetworkValue";
import {IdeaMilestoneDescription} from "./IdeaMilestoneDescription";
import {IdeaMilestoneDateRange} from "./IdeaMilestoneDateRange";
import {Card} from "../../../../components/card/Card";
import {CardDetails} from "../../../../components/card/components/CardDetails";
import {CardHeader} from "../../../../components/card/components/CardHeader";

const useStyles = makeStyles(() => createStyles({
    cardContent: {
        margin: '0 20px 0 24px',
        cursor: 'pointer'
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

                <CardHeader>
                    <IdeaMilestoneOrdinalNumber ordinalNumber={ideaMilestone.ordinalNumber} />
                    <IdeaMilestoneDateRange dateFrom={ideaMilestone.dateFrom} dateTo={ideaMilestone.dateTo} />
                </CardHeader>

                <Divider />

                <CardDetails>
                    <NetworkCardTitle title={ideaMilestone.subject} />
                    { ideaMilestone.networks && ideaMilestone.networks.length > 0
                        ? <NetworkValue value={ideaMilestone.networks[0].value} />
                        : null
                    }
                </CardDetails>

                <div className={classes.description}>
                    <IdeaMilestoneDescription description={ideaMilestone.description} />
                </div>

            </div>
        </Card>
    )
}
