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

function ProblemsetStandings() {
    React.useEffect(() => {
        document.title = "Problemset - Standings"
    })

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
                                <TableCellHead title="Who" />
                                <TableCellHead title="=" />
                            </TableRow>
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </React.Fragment>
    )
}
export default ProblemsetStandings