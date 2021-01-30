import React from "react";
import {Button} from "../components/button/Button";
import IdeaStatusFilters, {IdeaFilter} from "./list/IdeaStatusFilters";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {useTranslation} from "react-i18next";
import {ROUTE_NEW_IDEA} from "../routes";
import {useHistory} from "react-router-dom";
import {ideasHorizontalMargin, ideasMobileHorizontalMargin} from "./Ideas";
import {TimeSelect} from "../components/select/TimeSelect";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingTop: '32px',
        },
        newIdeaButton: {
            margin: `0 ${ideasHorizontalMargin}`,
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginBottom: '8px'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${ideasMobileHorizontalMargin} 16px ${ideasMobileHorizontalMargin}`,
                flex: 1
            },
        },
        flexBreakLine: {
            order: 3,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                flexBasis: '100%',
                height: 0,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        timeSelectWrapper: {
            order: 5,
            borderRadius: '8px',
            margin: `32px ${ideasHorizontalMargin}`,
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                margin: `0 ${ideasHorizontalMargin}`
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingTop: '8px',
                paddingLeft: ideasMobileHorizontalMargin
            },
        },
        paperBackground: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'initial',
                flexGrow: 1,
                order: 4,
                backgroundColor: theme.palette.background.paper
            }
        },
        statusFilters: {
            order: 4,
            margin: `${ideasHorizontalMargin}`,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
                margin: `12px ${ideasHorizontalMargin}`,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
                margin: 0,
                background: theme.palette.background.paper,
                paddingTop: '8px',
                paddingRight: ideasMobileHorizontalMargin
            }
        },
    }))

interface Props {
    filter: IdeaFilter
}

const IdeasHeader: React.FC<Props> = ({filter}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    return <div className={classes.header}>
        <Button className={classes.newIdeaButton}
                variant="contained"
                color="primary"
                onClick={goToNewIdea}>
            {t('idea.introduce')}
        </Button>
        <div className={classes.flexBreakLine}/>
        <div className={classes.timeSelectWrapper}>
            <TimeSelect/>
        </div>
        <div className={classes.paperBackground}/>
        <div className={classes.statusFilters}>
            <IdeaStatusFilters filter={filter}/>
        </div>
    </div>
}

export default IdeasHeader
