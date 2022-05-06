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
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

function Problemset() {
    const { session } = React.useContext(SessionContext)
    const [problems, setProblems] = React.useState([])
    const [problems_clone, setProblemsClone] = React.useState([])
    const navigate = useNavigate()

    React.useEffect(() => {
        document.title = "Problemset"
    })

    React.useEffect(() => {
        Axios.get("http://localhost:3001/problems", { withCredentials: true }).then(res => {
            setProblems(res.data)
            setProblemsClone(res.data)
        })
    }, [])

    const onModifyClick = (e, value) => {
        e.preventDefault()
        navigate(`/problemsets/problem/${value}/edit`, { replace: true })
    }

    const onDeleteClick = (e, value) => {
        e.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this problem?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/problem/${value}`, { withCredentials: true }).then(res => {
                    swal.fire({
                        title: <strong>Deleted!</strong>,
                        html: <div>Problem {value} has been deleted</div>,
                        icon: 'success'
                    }).then(function () {
                        setProblems(problems.filter(problem => problem.problem_code !== value))
                        setProblemsClone(problems_clone.filter(problem => problem.problem_code !== value))
                    })
                }).catch(err => {
                    swal.fire({
                        title: <strong>Error</strong>,
                        html: err.response.data.message,
                        icon: 'error'
                    }).then(function () {
                        if (err.response.data.message === 'Please login first') {
                            document.location = ''
                        }
                    })
                })
            }
        })
    }

    const onSearchProblem = (value) => {
        if (value === '') {
            setProblems(problems_clone)
        } else {
            setProblems(problems_clone.filter(problem => problem.problem_code.toLowerCase().includes(value.toLowerCase())))
        }
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
                                <TableCellHead title="Problem ID" />
                                <TableCellHead title="Problem name" />
                                {session.role === 1 && <TableCellHead title="Action" />}
                            </TableRow>
                            {
                                problems.map((value, key) => (
                                    <React.Fragment key={key}>
                                        <TableRow>
                                            <TableCell padding="10px" title={key + 1} href={`/problemsets/problem/${value.problem_code}`} />
                                            <TableCell padding="10px" title={value.problem_code} href={`/problemsets/problem/${value.problem_code}`} />
                                            <TableCell padding="10px" title={value.problem_name} href={`/problemsets/problem/${value.problem_code}`} />
                                            {session.role === 1 &&
                                                <TableCell padding="10px" >
                                                    <div style={{ display: "flex", columnGap: "10px", justifyContent: "center" }}>
                                                        <button className="btn-submit" style={{ margin: 0 }} onClick={(e) => onModifyClick(e, value.problem_code)}>Modify</button>
                                                        <button className="btn-submit" style={{ margin: 0 }} onClick={(e) => onDeleteClick(e, value.problem_code)}>Delete</button>
                                                    </div>
                                                </TableCell>
                                            }
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                    </LeftSideComponent>
                </LeftSide>

                <RightSide width="25%">
                    <RightSideComponent>
                        <div className='text-heading'>Search problem</div>
                        <input className="text-input" style={{ width: "100%" }} placeholder='Type to search...' type="text" onChange={(e) => onSearchProblem(e.target.value)} />
                    </RightSideComponent>
                    {session.role === 1 &&
                        <RightSideComponent>
                            <div className='text-heading'>Create problemset</div>
                            <form action='/problemsets/create'>
                                <button className='btn-submit' type='submit'>Create</button>
                            </form>

                        </RightSideComponent>
                    }
                </RightSide>

            </Content>
        </React.Fragment>
    )
}
export default Problemset