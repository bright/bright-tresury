import React from "react";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {NetworkCard} from "../../../../components/network/NetworkCard";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {breakpoints} from "../../../../theme/theme";
import {Divider} from "../../../../components/divider/Divider";
import {IdeaMilestoneOrdinalNumber} from "./IdeaMilestoneOrdinalNumber";
import {NetworkCardTitle} from "../../../../components/network/NetworkCardTitle";
import {NetworkValue} from "../../../../components/network/NetworkValue";
import {IdeaMilestoneDescription} from "./IdeaMilestoneDescription";
import {IdeaMilestoneDateRange} from "./IdeaMilestoneDateRange";

const useStyles = makeStyles((theme: Theme) => createStyles({
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
        <NetworkCard showNetworkAccentLine={false} onClick={() => onClick(ideaMilestone)}>

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

        </NetworkCard>
    )
}
