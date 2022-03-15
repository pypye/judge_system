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

function ProblemsetStatus() {
    React.useEffect(() => {
        document.title = "Problemset - Status"
    })

    return (
        <div>
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
                                <TableCellHead title="Chi tiết" />
                            </TableRow>
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </div>
    )
}
export default ProblemsetStatus