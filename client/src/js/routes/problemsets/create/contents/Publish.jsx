import React from 'react'
import Axios from 'axios'
import { ProblemsetInfoContext } from '../../../../context'

function Publish(props) {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)

    const [test, setTest] = React.useState()

    const onSubmitClick = (e) => {
        e.preventDefault()
        if (!props.edit) {
            Axios.post("http://localhost:3001/problem", info, { withCredentials: true }).then(res => {
                console.log(res.data)
                const data = new FormData()
                data.append("file", test)
                Axios.post(`http://localhost:3001/problem/test/upload/${info.problem_code}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }).then(res => {
                    alert("successful")
                })
            })
        } else {
            Axios.put(`http://localhost:3001/problem/${info.problem_code}`, info, { withCredentials: true }).then(res => {
                console.log(res.data)
                const data = new FormData()
                data.append("file", test)
                console.log(data)
                Axios.post(`http://localhost:3001/problem/test/upload/${info.problem_code}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }).then(res => {
                    alert("successful")
                })
            })
        }
        console.log(info)
        console.log(test)
    }
    return (
        <React.Fragment>
            <div className="text-heading">Tests</div>
            <input type="file" className="choose-file" onChange={(e) => setTest(e.target.files[0])} />

            {/* <div className="text-heading">Preview <a href='#'>here</a></div> */}
            <button type="submit" className="btn-submit" onClick={(e) => onSubmitClick(e)}>Publish</button>
        </React.Fragment>
    )
}
export default Publish