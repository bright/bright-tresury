import ShortText from './ShortText'
import { useTimeLeft } from '../../util/useTimeLeft'
import { timeToString } from '../../util/dateUtil'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    blockNumber: string
    placeholder: string
}
export type BlockNumberShortTextProps = OwnProps

const BlockNumberShortText = ({ blockNumber, placeholder }: BlockNumberShortTextProps) => {
    const { t } = useTranslation()
    const { timeLeft } = useTimeLeft(blockNumber)
    const text = timeLeft ? timeToString(timeLeft, t) : ''
    return <ShortText text={text} placeholder={placeholder} />
}
export default BlockNumberShortText
