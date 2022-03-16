import React, { Fragment } from 'react'
import { ProblemsetInfoContext } from '../../../../context'

function Cell(props) {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)

    const onInfoChange = (type, value) => {
        const items = { ...info }
        items[type] = value
        setInfo(items)
    }

    return (
        <tr>
            <td>{props.title}</td>
            <td>
                <div>
                    <div>
                        <input className="text-input"
                            type="text" value={info[props.type]}
                            onChange={(e) => onInfoChange(props.type, e.target.value)} autoComplete='true' required />
                        &nbsp;{props.ext}
                    </div>
                    <div className='text-annotation'>{props.annotation}</div>
                </div>
            </td>
        </tr>

    )
}
export default Cell