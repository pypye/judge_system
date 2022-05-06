import React from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

function ModifyUser({ username, setUsername }) {
    const [user, setUser] = React.useState({ username: '', name: '', password: '', role: '' })
    const [closeOnDocumentClick, setCloseOnDocumentClick] = React.useState(true)
    React.useState(() => {
        Axios.get(`http://localhost:3001/user?id=${username}`, { withCredentials: true }).then(res => {
            setUser(res.data)
        })
    }, [])

    const onUserChange = (type, value) => {
        const items = { ...user }
        items[type] = value
        setUser(items)
    }

    const onSave = (e) => {
        e.preventDefault()
        const regex = /([A-Za-z0-9_]+)/
        if (user.username === '') { setCloseOnDocumentClick(false); swal.fire({ title: <strong>Error</strong>, html: 'Username cannot be null', icon: 'error' }).then(() => setCloseOnDocumentClick(true)) }
        else if (regex.test(user.username) === false) { setCloseOnDocumentClick(false); swal.fire({ title: <strong>Error</strong>, html: 'Username can only contain number, alphabet character, and underscore', icon: 'error' }).then(() => setCloseOnDocumentClick(true)) }
        else if (user.name === '') { setCloseOnDocumentClick(false); swal.fire({ title: <strong>Error</strong>, html: 'Name cannot be null', icon: 'error' }).then(() => setCloseOnDocumentClick(true)) }
        else {
            Axios.put(`http://localhost:3001/user`, user, { withCredentials: true }).then(res => {
                swal.fire({
                    title: <strong>Success</strong>,
                    html: <div>Modify user success</div>,
                    icon: 'success',
                }).then(function () {
                    document.location = '/manage'
                })
            }).catch(err => {
                setCloseOnDocumentClick(false);
                swal.fire({ title: <strong>Error</strong>, html: err.response.data.message, icon: 'error' }).then(
                    () => {
                        if (err.response.data.message === 'Please login first') {
                            document.location = ''
                        } else setCloseOnDocumentClick(true)
                    }
                )
            })
        }
    }

    return <React.Fragment>
        <Popup open={username !== null} onClose={() => setUsername(null)} closeOnDocumentClick={closeOnDocumentClick}>
            <div className="popup-div">
                <div className='text-heading'>Modify User</div>
                <table>
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td><input className="text-input" type="text" value={user.username} disabled autoComplete='true' required /></td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td><input className="text-input" type="text" value={user.name} onChange={(e) => onUserChange('name', e.target.value)} autoComplete='true' required /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td>
                                <input className="text-input" type="text" value={user.password} onChange={(e) => onUserChange('password', e.target.value)} autoComplete='true' required />
                                <div className='text-annotation'>Leave blank for 12345</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Role</td>
                            <td>
                                <select className="text-input" value={user.role} onChange={(e) => onUserChange('role', e.target.value)}>
                                    <option value={0}>Student</option>
                                    <option value={1}>Administrator</option>
                                </select>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <button type="submit" className="btn-submit" onClick={(e) => onSave(e)}>Save</button>
            </div>

        </Popup>

    </React.Fragment>
} export default ModifyUser