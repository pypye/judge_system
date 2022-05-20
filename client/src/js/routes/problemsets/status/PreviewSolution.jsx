import Axios from "axios"
import React from "react"
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Editor from "@monaco-editor/react"
function PreviewSolution({ id, setId }) {
    const [content, setContent] = React.useState()
    const [log, setLog] = React.useState({ log_detail: [], log_total: null })

    const verdict = { 0: ["Accepted", "green"], 1: ["Wrong answer", "red"], 4294967295: ["Time limit exceeded", "#dd8f00"], 4294967294: ["Memory limit exceeded", "#dd8f00"] }

    React.useEffect(() => {
        Axios.get(`http://localhost:3001/submissions/show/${id}`, { withCredentials: true }).then(res => {
            //console.log(res.data)
            setContent(res.data)
        })
        Axios.get(`http://localhost:3001/submissions/log/${id}`, { withCredentials: true }).then(res => {
            setLog(res.data)
        })
    }, [id])
    return <React.Fragment>
        <Popup open={id !== null} onClose={() => setId(null)}>
            <div className="popup-div">
                <h4>Submit id: {id}</h4>
                {content ? <Editor height="450px" language="cpp" value={content} options={{ readOnly: true }} /> : "Source code not allowed"}
                <h4>Judge log: </h4>
                <table>
                    <tbody>
                        {log.log_detail.map((value, key) => (
                            <React.Fragment key={key}>
                                <tr>
                                    <td style={{padding: "3px"}}>Test{key+1}:</td>
                                    <td style={{padding: "3px"}}>
                                        <div style={{ color: verdict[value.exit_code] ? verdict[value.exit_code][1] : '#dd8f00', fontWeight: 500 }}>
                                            {verdict[value.exit_code] ? verdict[value.exit_code][0] : 'Runtime Error'}
                                        </div>
                                    </td>
                                    <td style={{padding: "3px"}}>[{value.time} ms, {value.memory} MB]</td>
                                    <td style={{padding: "3px"}}>
                                        ({value.point}/{value.test_point})
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        </Popup>

    </React.Fragment>

} export default PreviewSolution