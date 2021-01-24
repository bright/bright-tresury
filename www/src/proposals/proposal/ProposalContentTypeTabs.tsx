import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import infoIcon from "../../assets/info.svg";
import milestonesIcon from "../../assets/milestones.svg";
import discussionIcon from "../../assets/discussion.svg";
import votingIcon from "../../assets/voting.svg";
import {useRouteMatch} from "react-router-dom";

export enum ProposalContentType {
    Info = "info",
    Milestones = "milestones",
    Discussion = "discussion",
    Voting = "voting"
}

const ProposalContentTypeTabs: React.FC = () => {
    const {t} = useTranslation()

    const getTranslation = (proposalContentType: ProposalContentType): string => {
        switch (proposalContentType) {
            case ProposalContentType.Info:
                return t('proposal.content.infoLabel')
            case ProposalContentType.Milestones:
                return t('proposal.content.milestonesLabel')
            case ProposalContentType.Discussion:
                return t('proposal.content.discussionLabel')
            case ProposalContentType.Voting:
                return t('proposal.content.votingLabel')
        }
    }

    const getIcon = (proposalContentType: ProposalContentType): string => {
        switch (proposalContentType) {
            case ProposalContentType.Info:
                return infoIcon
            case ProposalContentType.Milestones:
                return milestonesIcon
            case ProposalContentType.Discussion:
                return discussionIcon
            case ProposalContentType.Voting:
                return votingIcon
        }
    }

    const contentTypes = Object.values(ProposalContentType)

    let {url} = useRouteMatch();

    const tabEntries = contentTypes.map((contentType: ProposalContentType) => {
            return {
                label: getTranslation(contentType),
                path: `${url}/${contentType}`,
                svg: getIcon(contentType)
            } as TabEntry
        }
    )

    return <div>
        <Tabs values={tabEntries}/>
    </div>
}

export default ProposalContentTypeTabs
