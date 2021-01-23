import React from 'react';
import ProposalsHeader from "./ProposalsHeader";

export const proposalsHorizontalMargin = '32px'
export const proposalsMobileHorizontalMargin = '18px'

const Proposals: React.FC<{}> = () => {
    return (
        <div>
            <ProposalsHeader/>
        </div>
    );
}

export default Proposals
