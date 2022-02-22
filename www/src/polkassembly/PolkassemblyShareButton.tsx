import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import polkassemblyLogoSvg from '../assets/polkassembly_logo.png'
import Button, { ButtonProps } from '../components/button/Button'
import { useModal } from '../components/modal/useModal'
import { useNetworks } from '../networks/useNetworks'
import { PolkassemblyPostDto } from './api/polkassembly-posts.dto'
import PolkassemblyShareModal from './PolkassemblyShareModal'

const useStyles = makeStyles(() =>
    createStyles({
        text: {
            fontSize: '16px',
        },
        logo: {
            height: '26px',
            marginLeft: '6px',
        },
    }),
)

interface OwnProps {
    web3address: string
    postData: PolkassemblyPostDto
}

export type PolkassemblyShareButtonProps = OwnProps & ButtonProps

const PolkassemblyShareButton = ({ web3address, postData, ...props }: PolkassemblyShareButtonProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const location = useLocation()
    const modal = useModal((location.state as any)?.share)
    const { network } = useNetworks()

    if (!network.polkassemblyUrl) {
        return null
    }

    return (
        <>
            <Button variant="text" color="primary" onClick={modal.open} {...props}>
                <span className={classes.text}>{t('polkassembly.share.button.shareOn')}</span>
                <img
                    className={classes.logo}
                    src={polkassemblyLogoSvg}
                    alt={t('polkassembly.share.button.polkassemblyLogoAlt')}
                />
            </Button>
            <PolkassemblyShareModal
                onClose={modal.close}
                open={modal.visible}
                web3address={web3address}
                postData={postData}
            />
        </>
    )
}

export default PolkassemblyShareButton
