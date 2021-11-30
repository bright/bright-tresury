import { useState } from 'react'
import { Nil } from '../../../util/types'

export interface UseFoldResult {
    folded: boolean
    invertFolded: () => void
}

export const useFold = (initialFolded?: Nil<boolean>): UseFoldResult => {
    const [folded, setFolded] = useState<boolean>(initialFolded ?? true)

    const invertFolded = () => setFolded(!folded)

    return { folded, invertFolded }
}
