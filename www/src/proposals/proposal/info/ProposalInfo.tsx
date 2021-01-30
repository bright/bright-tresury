import React from "react";
import {ProposalDto} from "../../proposals.api";

interface Props {
    proposal: ProposalDto
}

const ProposalInfo: React.FC<Props> = ({proposal}) => {
    return <div>
        Info
    </div>
}

export default ProposalInfo
