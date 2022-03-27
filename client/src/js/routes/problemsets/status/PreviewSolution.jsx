import Axios from "axios"
import React from "react"
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Editor from "@monaco-editor/react"
function PreviewSolution({ id, setId }) {
    const [content, setContent] = React.useState()


    React.useEffect(() => {
        Axios.get(`http://localhost:3001/submissions/show/${id}`, { withCredentials: true }).then(res => {
            //console.log(res.data)
            setContent(res.data)
        })
    }, [id])
    return <React.Fragment>
        <Popup open={id !== null} onClose={() => setId(null)}>
            <div className="popup-div">
                <h5>Submit id: {id}</h5>
                {content ? <Editor height="450px" language="cpp" value={content} options={{ readOnly: true }} /> : "Source code not allowed"}
            </div>

        </Popup>

    </React.Fragment>

} export default PreviewSolution