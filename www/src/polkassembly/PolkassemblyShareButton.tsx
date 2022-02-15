import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import Button, { ButtonProps } from '../components/button/Button'
import polkassemblyLogoSvg from '../assets/polkassembly_logo.png'
import { useModal } from '../components/modal/useModal'
import PolkassemblyShareModal, { PolkassemblyPostDto } from './PolkassemblyShareModal'

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
