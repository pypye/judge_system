import Editor from '@monaco-editor/react'
import React from 'react'
import Axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

function Submit() {
    var ref = React.createRef()
    const [info, setInfo] = React.useState({ language: "cpp" })
    const [problemCode, setProblemCode] = React.useState("")

    const onInfoChange = (type, value) => {
        const temp = { ...info }
        temp[type] = value
        setInfo(temp)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(info)

        console.log(problemCode)
        Axios.post(`http://localhost:3001/submit/${problemCode}`, info, { withCredentials: true })
            .then(res => {
                swal.fire({
                    title: <strong>Success</strong>,
                    html: res.data.message,
                    icon: 'success',
                }).then(function(){
                    document.location = '/problemsets/status'
                })
            })
            .catch(err => {
                swal.fire({
                    title: <strong>Error</strong>,
                    html: err.response.data.message,
                    icon: 'error'
                }).then(function(){
                    if(err.response.data.message === 'Please login first'){
                        document.location = ''
                    }
                })
            })
    }

    return (
        <form ref={ref}>
            <div className="text-heading">Submit solution</div>
            <div className="submit-info">
                <input className="text-input" placeholder="Problem ID" type="text" value={problemCode} onChange={e => setProblemCode(e.target.value)} required />
                <select className="text-input" value={info['language']} onChange={(e) => onInfoChange('language', e.target.value)}>
                    <option value="cpp">.cpp</option>
                    <option value="c">.c</option>
                    <option value="java">.java</option>
                    <option value="pascal">.pas</option>
                    <option value="python">.py</option>
                </select>
            </div>
            <div>
                <Editor height="calc(min(350px, max(150px, 100vh - 430px)))" options={{ automaticLayout: true }} language={info['language']} onChange={(value) => onInfoChange('contents', value)} />
            </div>

            <button type="submit" className="btn-submit" onClick={onSubmit}>Submit</button>
        </form>
    )
}
export default Submit