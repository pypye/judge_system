import { AiFillHome, AiFillTrophy } from 'react-icons/ai'
import { IoNewspaperOutline } from 'react-icons/io5'
import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import NavigationComponent from './NavigationComponent'
import Dropdown from '../utils/Dropdown'
import DropdownComponent from '../utils/DropdownComponent'
import Icon from '../utils/Icon'
import React from 'react'
import { SessionContext } from '../../context'

function Navigation(props) {
    const user = React.useContext(SessionContext)
    return (
        <div>
            <div className="nav">
                <NavigationComponent path="/" title="Home" uppercase />
                <NavigationComponent path="/problemsets" title="Problemsets" uppercase />
                {user.is_admin === 1 && <NavigationComponent path="/admin" title="Admin Area" uppercase />}
            </div>
            <div className="nav-dropdown">
                <Dropdown trigger={<Icon><BsFillGrid3X3GapFill /></Icon>} drop="center">
                    <DropdownComponent title="Home" icon={<AiFillHome />} href='/' />
                    <DropdownComponent title="Problemsets" icon={<IoNewspaperOutline />} href='/problemsets' />
                    {user.is_admin === 1 && <DropdownComponent title="Admin Area" icon={<GrUserAdmin />} href="/admin" />}
                </Dropdown>
            </div>

        </div>

    )
}
export default Navigation