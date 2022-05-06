import React from 'react'
import Axios from 'axios'
import { ProblemsetInfoContext } from '../../../../context'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

function swal_success(message) {
    swal.fire({
        title: <strong>Success</strong>,
        html: <div>{message}</div>,
        icon: 'success',
    }).then(function () {
        document.location = '/problemsets'
    })
}

function swal_error(err) {
    swal.fire({
        title: <strong>Error</strong>,
        html: err.response.data.message,
        icon: 'error'
    }).then(function () {
        if (err.response.data.message === 'Please login first') {
            document.location = ''
        }
    })
}

function Publish(props) {
    const { info } = React.useContext(ProblemsetInfoContext)

    const [test, setTest] = React.useState([])

    const onSubmitClick = (e) => {
        e.preventDefault()
        const regex = /([A-Za-z0-9_]+)/
        if (info.problem_code === '') swal.fire({ title: <strong>Error</strong>, html: 'Problem ID cannot be null', icon: 'error' })
        else if (regex.test(info.problem_code) === false) swal.fire({ title: <strong>Error</strong>, html: 'Problem ID can only contain number, alphabet character, and underscore', icon: 'error' })
        else if (info.problem_name === '') swal.fire({ title: <strong>Error</strong>, html: 'Problem name cannot be null', icon: 'error' })
        else if (info.file_input === '') swal.fire({ title: <strong>Error</strong>, html: 'Input file cannot be null', icon: 'error' })
        else if (info.file_output === '') swal.fire({ title: <strong>Error</strong>, html: 'Output file cannot be null', icon: 'error' })
        else if (info.limit_time === '') swal.fire({ title: <strong>Error</strong>, html: 'Time limit cannot be null', icon: 'error' })
        else if (info.limit_memory === '') swal.fire({ title: <strong>Error</strong>, html: 'Memory limit cannot be null', icon: 'error' })
        else {
            if (!props.edit) {
                if (test.length <= 0) swal.fire({ title: <strong>Error</strong>, html: 'Please choose tests!', icon: 'error' })
                else {
                    Axios.post("http://localhost:3001/problem", info, { withCredentials: true }).then(res => {
                        const data = new FormData()
                        for (let i = 0; i < test.length; i++) {
                            data.append("file", test[i], window.btoa(test[i].webkitRelativePath));
                        }
                        data.append('problem_code', info.problem_code)
                        Axios.post(`http://localhost:3001/problem/test/upload/${info.problem_code}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }).then(res => {
                            swal_success('Create problem successfully')
                        }).catch(err => swal_error(err))
                    })
                }

            } else {
                Axios.put(`http://localhost:3001/problem/${info.problem_code}`, info, { withCredentials: true }).then(res => {
                    if (test.length > 0) {
                        const data = new FormData()
                        for (let i = 0; i < test.length; i++) {
                            data.append("file", test[i], window.btoa(test[i].webkitRelativePath));
                        }
                        data.append('problem_code', info.problem_code)
                        Axios.post(`http://localhost:3001/problem/test/upload/${info.problem_code}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }).then(res => {
                            swal_success('Modify problem successfully')
                        }).catch(err => swal_error(err))
                    } else {
                        swal_success('Modify problem successfully')
                    }
                }).catch(err => swal_error(err))
            }
        }
    }
    return (
        <React.Fragment>
            <div className="text-heading">Tests</div>
            <input directory="" webkitdirectory="" type="file" onChange={(e) => setTest(e.target.files)} />
            <button type="submit" className="btn-submit" onClick={(e) => onSubmitClick(e)}>Publish</button>
        </React.Fragment>
    )
}
export default Publish