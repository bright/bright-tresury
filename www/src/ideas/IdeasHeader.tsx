import React from "react";
import {Button} from "../components/button/Button";
import IdeaStatusFilters, {IdeaFilter} from "./list/IdeaStatusFilters";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {useTranslation} from "react-i18next";
import {ROUTE_NEW_IDEA} from "../routes";
import {useHistory} from "react-router-dom";
import {TimeSelect} from "../components/select/TimeSelect";
import {HeaderListContainer, mobileHeaderListHorizontalMargin} from "../components/header/list/HeaderListContainer";
import {BasicInfo} from "../components/header/BasicInfo";
import {FlexBreakLine} from "../components/header/FlexBreakLine";
import {HeaderListTabs} from "../components/header/list/HeaderListTabs";
import {PaperFilterBackground} from "../components/header/list/PaperFilterBackground";
import {TimeSelectWrapper} from "../components/header/list/TimeSelectWrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newIdeaButton: {
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
                flex: 1
            },
        },
        flexBreakLine: {
            order: 3,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        timeSelectWrapper: {
            order: 5,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
        paperBackground: {
            order: 4,
        },
        statusFilters: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
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

    return <HeaderListContainer>
        <BasicInfo>
            <Button className={classes.newIdeaButton}
                    variant="contained"
                    color="primary"
                    onClick={goToNewIdea}>
                {t('idea.introduce')}
            </Button>
        </BasicInfo>
        <FlexBreakLine className={classes.flexBreakLine}/>
        <TimeSelectWrapper className={classes.timeSelectWrapper}>
            <TimeSelect/>
        </TimeSelectWrapper>
        <PaperFilterBackground className={classes.paperBackground}/>
        <HeaderListTabs className={classes.statusFilters}>
            <IdeaStatusFilters filter={filter}/>
        </HeaderListTabs>
    </HeaderListContainer>
}

export default IdeasHeader
