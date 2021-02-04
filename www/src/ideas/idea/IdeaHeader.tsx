import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {ROUTE_IDEAS} from "../../routes";
import {IdeaDto} from "../ideas.api";
import {Button} from "../../components/button/Button";
import SubmitProposalModal from "../SubmitProposalModal";
import {breakpoints} from "../../theme/theme";
import IdeaContentTypeTabs from "./IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "./status/IdeaStatusIndicator";
import {NetworkRewardDeposit} from "../../components/network/NetworkRewardDeposit";
import {CloseIcon} from "../../components/closeIcon/CloseIcon";
import {OptionalTitle} from "../../components/text/OptionalTitle";
import {BasicInfo} from "../../components/header/BasicInfo";
import {HeaderContainer} from "../../components/header/HeaderContainer";
import {NetworkValues} from "../../components/header/NetworkValues";
import {FlexBreakLine} from "../../components/header/FlexBreakLine";
import {ContentTypeTabs} from "../../components/header/ContentTypeTabs";
import {BasicInfoDivider} from "../../components/header/BasicInfoDivider";
import {Status} from "../../components/header/Status";
import {Title} from "../../components/header/Title";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        ideaId: {
            fontSize: '18px',
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        flexBreakLine: {
            order: 3
        },
        networkValues: {
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            }
        },
        convertToProposal: {
            order: 5,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                alignSelf: 'flex-end'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                alignSelf: 'flex-end',
                marginBottom: 24
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                zIndex: 1
            }
        },
        convertToProposalButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%'
            }
        }
    }))

interface Props {
    idea: IdeaDto,
    canEdit: boolean
}

const IdeaHeader: React.FC<Props> = ({idea, canEdit}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    const [submitProposalVisibility, setSubmitProposalVisibility] = useState(false);

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    const networkValue = idea.networks && idea.networks.length > 0 ? idea.networks[0].value : 0

    return <HeaderContainer>
        <CloseIcon onClose={navigateToList}/>
        <BasicInfo>
            <div className={classes.ideaId}>
                {idea.id}
            </div>
            <BasicInfoDivider/>
            <Status>
                <IdeaStatusIndicator ideaStatus={idea.status}/>
            </Status>
            <Title>
                <OptionalTitle title={idea.title}/>
            </Title>
        </BasicInfo>
        <NetworkValues className={classes.networkValues}>
            <NetworkRewardDeposit rewardValue={networkValue}/>
        </NetworkValues>
        <FlexBreakLine className={classes.flexBreakLine}/>
        <ContentTypeTabs className={classes.contentTypeTabs}>
            <IdeaContentTypeTabs/>
        </ContentTypeTabs>
        {!!idea.id && <div className={classes.convertToProposal}><Button
            variant="contained"
            color="primary"
            className={classes.convertToProposalButton}
            onClick={() => setSubmitProposalVisibility(true)}>
            {t('idea.details.header.convertToProposal')}
        </Button></div>
        }
        <SubmitProposalModal
            open={submitProposalVisibility}
            onClose={() => setSubmitProposalVisibility(false)}
            idea={idea}/>
    </HeaderContainer>
}

export default IdeaHeader
