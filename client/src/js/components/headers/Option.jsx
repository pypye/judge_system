import Dropdown from "../utils/Dropdown"
import DropdownComponent from "../utils/DropdownComponent"
import NavigationComponent from "./NavigationComponent"
import { IoMoon, IoLogOut } from 'react-icons/io5'
import { MdHelp } from 'react-icons/md'
import { AiFillCaretDown } from 'react-icons/ai'
import { useNavigate } from "react-router-dom"
import Icon from "../utils/Icon"
import Axios from "axios"
import { SessionContext } from "../../context"
import React from "react"

function Option() {
    const session = React.useContext(SessionContext)
    const navigate = useNavigate()
    
    const doLogout = () => {
        Axios.post("http://localhost:3001/logout", {}, { withCredentials: true }).then(res => {
            if (res.data.success) navigate('/', {replace: true})
        })
    }

    return (
        <div className="option">
            <NavigationComponent path="profile" title={session.name} />

            <Dropdown trigger={<Icon><AiFillCaretDown /></Icon>} drop="right">
                <DropdownComponent title="About" annotation="Questions..." icon={<MdHelp />} />
                <DropdownComponent title="Dark mode" annotation="Off" icon={<IoMoon />} />
                <DropdownComponent title="Log out" icon={<IoLogOut />} onClick={doLogout} />
            </Dropdown>



        </div>
    )
}
export default Option