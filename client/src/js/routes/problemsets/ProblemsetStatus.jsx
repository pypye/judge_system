import React from 'react'
import Content from "../../components/contents/Content"
import Header from "../../components/headers/Header"
import SubNavigation from "../../components/headers/SubNavigation"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"

import Table from '../../components/utils/Table'
import TableRow from '../../components/utils/TableRow'
import TableCell from '../../components/utils/TableCell'
import TableCellHead from '../../components/utils/TableCellHead'
import Axios from 'axios'

function ProblemsetStatus() {
    const [status, setStatus] = React.useState([])
    React.useEffect(() => {
        document.title = "Problemset - Status"
    })

    React.useEffect(() => {
        Axios.get("http://localhost:3001/submissions/all", { withCredentials: true }).then(res => {
            setStatus(res.data)
            console.log(res.data)
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
                                <TableCellHead title="Thời gian" />
                                <TableCellHead title="Thí sinh" />
                                <TableCellHead title="Tên bài" />
                                <TableCellHead title="Kết quả" />
                                <TableCellHead title="Time" />
                                <TableCellHead title="Memory" />
                            </TableRow>
                            {
                                status.map((value, key) => (
                                    <React.Fragment key={key}>
                                        <TableRow>
                                            <TableCell padding='15px' title={value.id} />
                                            <TableCell padding='15px' title={value.time_submit} />
                                            <TableCell padding='15px' title={value.username} />
                                            <TableCell padding='15px' title={value.problem_code} />
                                            <TableCell padding='15px' title={value.verdict} />
                                            <TableCell padding='15px' title={value.usage_time + ' ms'} />
                                            <TableCell padding='15px' title={value.usage_memory + ' MB'} />
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </React.Fragment>
    )
}
export default ProblemsetStatus