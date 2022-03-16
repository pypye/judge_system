import React from 'react'
import { ProblemsetInfoContext } from '../../../../context'

function ProblemsetPublish() {
    const { info } = React.useContext(ProblemsetInfoContext)

    return (
        <div>
            <div className="text-heading">Preview <a href='#'>here</a></div>
            <button type="submit" className="btn-submit" onClick={() => console.log(info)}>Publish</button>
        </div>
    )
}
export default ProblemsetPublish