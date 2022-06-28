import { TwitterIcon, TwitterShareButton } from 'react-share'
import React from 'react'
import { ClassNameProps } from '../props/className.props'
import { useNetworks } from '../../networks/useNetworks'

interface OwnProps {
    title: string
    url?: string
}

export type TwitterShareProps = OwnProps & ClassNameProps

const TwitterShare = ({ className, title, url }: TwitterShareProps) => {
    const { network } = useNetworks()
    return (
        <TwitterShareButton
            className={className}
            title={title}
            url={url ?? window.location.href}
            hashtags={['treasury', `${network.name}`]}
            via={'BrightTreasury'}
        >
            <TwitterIcon size={36} round={true} />
        </TwitterShareButton>
    )
}
export default TwitterShare
