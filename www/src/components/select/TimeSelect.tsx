import React from 'react'
import { useTranslation } from 'react-i18next'
import NavSelect  from './NavSelect'
import useTimeFrame, { TimeFrame, TimeSelectFilterSearchParamName } from '../../util/useTimeFrame'
import useLocationFactory from '../../util/useLocationFactory'

const TimeSelect = () => {
    const { t } = useTranslation()
    const { timeFrame } = useTimeFrame()
    const { setSearchParam } = useLocationFactory()

    const options: { [key in TimeFrame]: {label: string, path: string} } = {
        [TimeFrame.OnChain]: {
            label: t('components.timeSelect.onChain'),
            path: setSearchParam(TimeSelectFilterSearchParamName, TimeFrame.OnChain)
        },
        [TimeFrame.History]: {
            label: t('components.timeSelect.history'),
            path: setSearchParam(TimeSelectFilterSearchParamName, TimeFrame.History)
        },
    }

    return (
        <NavSelect value={options[timeFrame]} options={Object.values(options)} />
    )
}
export default TimeSelect

