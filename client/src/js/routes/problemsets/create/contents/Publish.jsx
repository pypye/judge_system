import React from 'react'
import { ProblemsetInfoContext } from '../../../../context'

function Publish() {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)

    const onInfoChange = (type, value) => {
        const items = { ...info }
        items[type] = value
        setInfo(items)
    }

    return (
        <React.Fragment>
            <div className="text-heading">Tests</div>
            <input type="file" className="choose-file" onChange={(e) => onInfoChange('tests', e.target.files)}/>
            
            {/* <div className="text-heading">Preview <a href='#'>here</a></div> */}
            <button type="submit" className="btn-submit" onClick={(e) => {e.preventDefault(); console.log(info)}}>Publish</button>
        </React.Fragment>
    )
}
export default Publish