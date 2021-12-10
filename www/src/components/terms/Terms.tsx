import React from 'react'
import treasuryTerms from './treasury-terms.md'
import DisplayMarkdown from '../markdown/DisplayMarkdown'

const Terms = () => {
    return <DisplayMarkdown markdownFile={treasuryTerms} />
}

export default Terms
