import Table from '../../../../components/utils/Table'
import TableRow from '../../../../components/utils/TableRow'
import TableCell from '../../../../components/utils/TableCell'
import TableCellHead from '../../../../components/utils/TableCellHead'

import React from 'react'
import { ProblemsetInfoContext } from '../../../../context'
import MarkdownArea from '../components/MarkdownArea'

function ProblemsetStatement() {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)
    const [example, setExample] = React.useState([])
    const onInfoChange = (event) => {
        const items = { ...info }
        items.content = (event.target.value === "1")
        setInfo(items)
    }

    return (
        <div className='flex-vertical'>
            <div className="text-heading">Statement</div>
            <div className='flex-vertical'>
                <MarkdownArea title='Main statement' height='300px' />
                <div>Example input/output </div>
                <Table>
                    <TableRow>
                        <TableCellHead title="Input" />
                        <TableCellHead title="Output" />
                        <TableCellHead title="Modify" />
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </Table>
                <MarkdownArea title='Notes' height='150px' />
            </div>
        </div>
    )
}
export default ProblemsetStatement