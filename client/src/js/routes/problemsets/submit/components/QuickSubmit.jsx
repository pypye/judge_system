import Axios from "axios"
import React from "react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

function QuickSubmit() {

    const [file, setFile] = React.useState()

    const onSubmitClick = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file", file)
        Axios.post(`http://localhost:3001/submit/quick/${file.name.split(".")[0].toLowerCase()}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } })
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
        <form>
            <div className="text-heading">Quick submit</div>
            <input type="file" className="choose-file" accept=".cpp, .c" onChange={e => { setFile(e.target.files[0]) }} required />
            <p className="text-annotation">
                File name format: [Problem ID].[extension]<br></br>
                Example: problem1.cpp<br></br>
                Max size: 1MB
            </p>
            <div><button type="submit" className="btn-submit" onClick={(e) => onSubmitClick(e)}>Submit</button></div>
        </form>
    )
}
export default QuickSubmit