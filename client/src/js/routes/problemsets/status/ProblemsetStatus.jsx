import React from 'react'
import Content from "../../../components/contents/Content"
import Header from "../../../components/headers/Header"
import SubNavigation from "../../../components/headers/SubNavigation"
import LeftSide from "../../../components/contents/LeftSide"
import LeftSideComponent from "../../../components/contents/LeftSideComponent"

import Table from '../../../components/utils/Table'
import TableRow from '../../../components/utils/TableRow'
import TableCell from '../../../components/utils/TableCell'
import TableCellHead from '../../../components/utils/TableCellHead'
import Axios from 'axios'
import PreviewSolution from './PreviewSolution'

import { io } from "socket.io-client"
import { SessionContext } from '../../../context'

function ProblemsetStatus() {
    const [status, setStatus] = React.useState([])
    const [previewSolution, setPreviewSolution] = React.useState(null)
    const { session } = React.useContext(SessionContext)

    const socket = React.useRef()

    React.useEffect(() => {
        document.title = "Problemset - Status"
    })

    React.useEffect(() => {
        socket.current = io("ws://localhost:8900")
        if (session.logged_in) {
            socket.current.on(`push-status-` + session.username, data => {
                setStatus(prev => [data, ...prev]);
            })

            socket.current.on("get-status-" + session.username, data => {
                setStatus((prev) =>
                    prev.map((row) => (row.id === data.id ? {
                        id: row.id,
                        time_submit: row.time_submit,
                        problem_code: row.problem_code,
                        language: row.language,
                        verdict: data.verdict,
                        usage_time: data.usage_time,
                        usage_memory: data.usage_memory
                    } : row))
                )
            })
        }

    }, [session])

    React.useEffect(() => {
        Axios.get("http://localhost:3001/submissions", { withCredentials: true }).then(res => {
            setStatus(res.data)
        })
    }, [])


    return (
        <React.Fragment>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        <Table>
                            <TableRow>
                                <TableCellHead title="#" />
                                <TableCellHead title="When" />
                                <TableCellHead title="Problem" />
                                <TableCellHead title="Language" />
                                <TableCellHead title="Verdict" />
                                <TableCellHead title="Time" />
                                <TableCellHead title="Memory" />
                            </TableRow>
                            {
                                status.map((value, key) => (
                                    <React.Fragment key={key}>
                                        <TableRow>
                                            <TableCell padding='6px'>
                                                <a href='/#' onClick={(e) => { e.preventDefault(); setPreviewSolution(value.id) }} style={{ textDecoration: "underline", color: 'blue' }}>{value.id}</a>
                                            </TableCell>
                                            <TableCell padding='6px' title={new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(value.time_submit)} />
                                            <TableCell padding='6px' title={value.problem_code} />
                                            <TableCell padding='6px' title={value.language} />
                                            <TableCell padding='6px'>
                                                <div style={{
                                                    fontWeight: value.verdict.includes('Inqueue') || value.verdict.includes('Judging') || value.verdict.includes('Running') ? 0 : 500,
                                                    color: value.verdict.includes('Error') ? 'red': (value.verdict.includes('Inqueue') || value.verdict.includes('Judging') || value.verdict.includes('Running') ? 'gray' : 'green')
                                                }}>
                                                    {value.verdict}
                                                </div>
                                            </TableCell>
                                            <TableCell padding='6px' title={value.usage_time + ' ms'} />
                                            <TableCell padding='6px' title={value.usage_memory + ' MB'} />
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                        {previewSolution !== null &&
                            <PreviewSolution id={previewSolution} setId={(state) => setPreviewSolution(state)}
                            />}
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </React.Fragment>
    )
}
export default ProblemsetStatus