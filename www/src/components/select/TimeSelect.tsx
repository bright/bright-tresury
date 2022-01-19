import React from 'react'
import { useTranslation } from 'react-i18next'
import NavSelect  from './NavSelect'
import { useTimeFrame, TimeFrame } from '../../util/useTimeFrame'

const TimeSelect = () => {
    const { t } = useTranslation()
    const { param: timeFrame, setParam: setTimeFrame } = useTimeFrame()

    const options: { [key in TimeFrame]: {label: string, path: string} } = {
        [TimeFrame.OnChain]: {
            label: t('components.timeSelect.onChain'),
            path: setTimeFrame(TimeFrame.OnChain)
        },
        [TimeFrame.History]: {
            label: t('components.timeSelect.history'),
            path: setTimeFrame(TimeFrame.History)
        },
    }

    return (
        <NavSelect value={options[timeFrame]} options={Object.values(options)} />
    )
}
export default TimeSelect

