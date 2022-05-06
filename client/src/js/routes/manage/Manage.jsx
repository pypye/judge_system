import Content from "../../components/contents/Content"
import Header from "../../components/headers/Header"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"
import RightSide from "../../components/contents/RightSide"
import RightSideComponent from "../../components/contents/RightSideComponent"
import React from "react"
import Table from "../../components/utils/Table"
import TableRow from "../../components/utils/TableRow"
import TableCellHead from "../../components/utils/TableCellHead"
import TableCell from "../../components/utils/TableCell"
import Axios from "axios"
import { SessionContext } from "../../context"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ModifyUser from "./ModifyUser"
import AddUser from "./AddUser"

const swal = withReactContent(Swal)


function Manage() {
    const { session } = React.useContext(SessionContext)
    const [users, setUsers] = React.useState([])
    const [users_clone, setUsersClone] = React.useState([])
    const [modifyUser, setModifyUser] = React.useState(null)
    const [addUser, setAddUser] = React.useState(null)

    React.useEffect(() => {
        document.title = "Manage"
    })
    React.useEffect(() => {
        Axios.get("http://localhost:3001/users", { withCredentials: true }).then(res => {
            setUsers(res.data)
            setUsersClone(res.data)
        })
    }, [])

    const onModifyClick = (e, value) => {
        e.preventDefault()
        setModifyUser(value)
    }

    const onDeleteClick = (e, value) => {
        e.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/user?id=${value}`, { withCredentials: true }).then(res => {
                    console.log(res)
                    swal.fire({
                        title: <strong>Deleted!</strong>,
                        html: <div>User {value} has been deleted</div>,
                        icon: 'success'
                    }).then(function () {
                        setUsers(users.filter(user => user.username !== value))
                        setUsersClone(users_clone.filter(user => user.username !== value))
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

    const onSearchUser = (value) => {
        if (value === '') {
            setUsers(users_clone)
        } else {
            setUsers(users_clone.filter(user => user.username.toLowerCase().includes(value.toLowerCase())))
        }
    }

    return (
        <React.Fragment>
            <Header />
            <Content>
                <LeftSide width="75%">
                    <LeftSideComponent>
                        <div className="text-heading">Users</div>
                        <Table>
                            <TableRow>
                                <TableCellHead title="#" />
                                <TableCellHead title="Username" />
                                <TableCellHead title="Name" />
                                <TableCellHead title="Role" />
                                <TableCellHead title="Action" />
                            </TableRow>
                            {
                                users.map((value, key) => (
                                    <React.Fragment key={key}>
                                        <TableRow>
                                            <TableCell padding="10px" title={key + 1} />
                                            <TableCell padding="10px" title={value.username} />
                                            <TableCell padding="10px" title={value.name} />
                                            <TableCell padding="10px" title={value.role} />
                                            <TableCell padding="10px" >
                                                <div style={{ display: "flex", columnGap: "10px", justifyContent: "center" }}>
                                                    <button className="btn-submit" style={{ margin: 0 }} onClick={(e) => onModifyClick(e, value.username)}>Modify</button>
                                                    {value.username !== session.username && <button className="btn-submit" style={{ margin: 0 }} onClick={(e) => onDeleteClick(e, value.username)}>Delete</button>}

                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                    </LeftSideComponent>
                </LeftSide>
                <RightSide width="25%">
                    <RightSideComponent>
                        <div className='text-heading'>Search users</div>
                        <input className="text-input" style={{ width: "100%" }} placeholder='Type to search...' type="text" onChange={(e) => onSearchUser(e.target.value)} />
                    </RightSideComponent>
                    <RightSideComponent>
                        <div className='text-heading'>Add user</div>
                        <button className='btn-submit' type='submit' onClick={() => {setAddUser(true)}}>Add</button>
                    </RightSideComponent>
                </RightSide>
            </Content>
            {modifyUser !== null && <ModifyUser username={modifyUser} setUsername={(state) => setModifyUser(state)} />}
            {addUser !== null && <AddUser username={addUser} setUsername={(state) => setAddUser(state)} />}
        </React.Fragment>

    )
}
export default Manage