import Table from '../../../components/utils/Table'
import TableRow from '../../../components/utils/TableRow'
import TableCell from '../../../components/utils/TableCell'
import TableCellHead from '../../../components/utils/TableCellHead'

import React from 'react'
import { ProblemsetInfoContext } from '../../../context'
import StatementNormalRow from './components/StatementNormalRow'

function ProblemsetStatement() {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)

    const onInfoChange = (event) => {
        const items = { ...info }
        items.pdf = (event.target.value === "1")
        setInfo(items)
    }

    return (
        <div className='flex-vertical'>
            <div className="text-heading">Statement</div>
            <div className='flex-horizontal'>
                <div>Method</div>
                <select className="text-input" value={info.pdf ? "1" : "0"} onChange={onInfoChange}>
                    <option value="1">Upload PDF</option>
                    <option value="0">Add problemset manually</option>
                </select>
            </div>
            {(info.pdf === true) && StatementPDF()}
            {(info.pdf === false) && StatementNormal()}
            <button type="submit" className="btn-submit">Save changes</button>
        </div>
    )

    function StatementPDF() {
        return (
            <div className='flex-horizontal' style={{ alignItems: "flex-end" }}>
                <div>Select file</div>
                <input type="file" className="choose-file" />
            </div>
        )
    }

    function StatementNormal() {
        return (
            <div className='flex-vertical'>
                <StatementNormalRow title='Main statement' height='300px' />
                <StatementNormalRow title='Input format' height='150px' />
                <StatementNormalRow title='Output format' height='150px' />
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
                <StatementNormalRow title='Notes' height='150px'/>
            </div>
        )
    }
}
export default ProblemsetStatement