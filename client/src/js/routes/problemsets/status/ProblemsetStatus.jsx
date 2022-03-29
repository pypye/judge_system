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

function ProblemsetStatus() {
    const [status, setStatus] = React.useState([])
    const [previewSolution, setPreviewSolution] = React.useState(null)
    React.useEffect(() => {
        document.title = "Problemset - Status"
    })

    React.useEffect(() => {
        Axios.get("http://localhost:3001/submissions/all", { withCredentials: true }).then(res => {
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
                                <TableCellHead title="Who" />
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
                                            <TableCell padding='6px' title={value.username} />
                                            <TableCell padding='6px' title={value.problem_code} />
                                            <TableCell padding='6px' title={value.language} />
                                            <TableCell padding='6px'>
                                                <div style={{ fontWeight: 500, color: value.verdict === 'Compilation Error' ? 'red' : 'green' }}>
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