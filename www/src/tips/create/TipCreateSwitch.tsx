import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ClassNameProps } from '../../components/props/className.props'
import SimpleToggleButton from '../../components/toggle/toggle-state/SimpleToggleButton'
import SimpleToggleButtonGroup from '../../components/toggle/toggle-state/SimpleToggleButtonGroup'
import SimpleToggleButtonSubtitle from '../../components/toggle/toggle-state/SimpleToggleButtonSubtitle'

export type TipCreateMode = 'createOnly' | 'createAndTip'

interface OwnProps {
    mode: TipCreateMode
    setMode: (mode: TipCreateMode) => void
}

export type TipCreateSwitchProps = OwnProps & ClassNameProps

const TipCreateSwitch = ({ mode, setMode, className }: TipCreateSwitchProps) => {
    const { t } = useTranslation()

    return (
        <SimpleToggleButtonGroup className={className} value={mode} setValue={setMode} exclusive>
            <SimpleToggleButton value="createOnly">
                <div>{t('tip.create.header.createOnly')}</div>
            </SimpleToggleButton>
            <SimpleToggleButton value="createAndTip">
                <div>{t('tip.create.header.createAndTip')}</div>
                <SimpleToggleButtonSubtitle>
                    {t('tip.create.header.createAndTipSubtitle')}
                    <Trans
                        id="tip-header-description"
                        components={{
                            a: <a target="_blank" href="https://wiki.polkadot.network/docs/learn-treasury#tipping" />,
                        }}
                        i18nKey="tip.create.header.account"
                    />
                </SimpleToggleButtonSubtitle>
            </SimpleToggleButton>
        </SimpleToggleButtonGroup>
    )
}

export default TipCreateSwitch
