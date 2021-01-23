import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {ideasHorizontalMargin, ideasMobileHorizontalMargin} from "./Ideas";
import Grid from "@material-ui/core/Grid";
import IdeaCard from "./list/IdeaCard";
import {IdeaDto} from "./ideas.api";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        tilesContainer: {
            padding: `26px ${ideasHorizontalMargin}`,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: `8px ${ideasMobileHorizontalMargin} 26px ${ideasMobileHorizontalMargin}`,
            },
        },
    })
})

interface Props {
    ideas: IdeaDto[]
}

const IdeasList: React.FC<Props> = ({ideas}) => {
    const classes = useStyles()

    return <div className={classes.tilesContainer}>
        <Grid container spacing={2}>
            {ideas.map((idea) =>
                <Grid key={idea.id} item xs={12} md={6}>
                    <IdeaCard idea={idea}/>
                </Grid>
            )}
        </Grid>
    </div>
}

export default IdeasList
