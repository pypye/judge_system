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
import { SessionContext } from '../../context'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Problemset() {
    const { session } = React.useContext(SessionContext)
    const [problems, setProblems] = React.useState([])
    const navigate = useNavigate()

    React.useEffect(() => {
        document.title = "Problemset"
    })

    React.useEffect(() => {
        Axios.get("http://localhost:3001/problems", { withCredentials: true }).then(res => {
            setProblems(res.data)
        })
    }, [])

    const onModifyClick = (e, value) => {
        e.preventDefault()
        navigate(`/problemsets/problem/${value}/edit`, { replace: true })
    }
    return (
        <React.Fragment>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide width={session.role !== 1 && "100%"}>
                    <LeftSideComponent>
                        <Table>
                            <TableRow>
                                <TableCellHead title="#" />
                                <TableCellHead title="Tên bài" />
                                {session.role === 1 && <TableCellHead title="Action" />}
                            </TableRow>
                            {
                                problems.map((value, key) => (
                                    <React.Fragment key={key}>
                                        <TableRow>
                                            <TableCell padding="10px" title={key + 1} href={`/problemsets/problem/${value.problem_code}`} />
                                            <TableCell padding="10px" title={value.problem_name} href={`/problemsets/problem/${value.problem_code}`} />
                                            {session.role === 1 && <TableCell padding="10px" ><button className="btn-submit" onClick={(e) => onModifyClick(e, value.problem_code)}>Modify</button></TableCell>}
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
                {session.role === 1 &&
                    <RightSide>
                        <RightSideComponent>
                            <form action='/problemsets/create'>
                                <button className='btn-submit' type='submit'>Create problemset</button>
                            </form>

                        </RightSideComponent>
                    </RightSide>
                }

            </Content>
        </React.Fragment>
    )
}
export default Problemset