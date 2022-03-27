import Axios from "axios"
import React from "react"

function QuickSubmit() {

    const [file, setFile] = React.useState()

    const onSubmitClick = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file", file)
        Axios.post(`http://localhost:3001/submit/${file.name.split(".")[0].toLowerCase()}`, data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } })
            .then(res => {
                if (!alert(res.data.message)) {
                    document.location = '/problemsets/status'
                }
            })
            .catch(res => {
                alert(res.response.data.message)
            })
    }

    return (
        <form>
            <div className="text-heading">Quick submit</div>
            <input type="file" className="choose-file" accept=".cpp, .c, .java, .pas, .py" onChange={e => { setFile(e.target.files[0]) }} required />
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