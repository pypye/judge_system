import React from 'react'
import Content from "../../components/contents/Content"
import Header from "../../components/headers/Header"
import SubNavigation from "../../components/headers/SubNavigation"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"
import RightSide from "../../components/contents/RightSide"
import RightSideComponent from "../../components/contents/RightSideComponent"

import Table from '../../components/utils/Table'
import TableRow from '../../components/utils/TableRow'
import TableCell from '../../components/utils/TableCell'
import TableCellHead from '../../components/utils/TableCellHead'
import ProblemsetAdd from './problemset_add/ProblemsetAdd'

function Problemset() {

    React.useEffect(() => {
        document.title = "Problemset"
    })


    return (
        <div>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide>
                    <LeftSideComponent admin>
                        <ProblemsetAdd />
                    </LeftSideComponent>
                    <LeftSideComponent>
                        <Table>
                            <TableRow>
                                <TableCellHead title="#" />
                                <TableCellHead title="Tên bài" />
                            </TableRow>
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
                <RightSide>
                    <RightSideComponent>
                    </RightSideComponent>
                </RightSide>
            </Content>
        </div>
    )
}
export default Problemset