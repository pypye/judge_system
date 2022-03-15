import { AiFillHome, AiFillTrophy } from 'react-icons/ai'
import { IoNewspaperOutline } from 'react-icons/io5'
import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import NavigationComponent from './NavigationComponent'
import Dropdown from '../utils/Dropdown'
import DropdownComponent from '../utils/DropdownComponent'
import Icon from '../utils/Icon'

function Navigation(props) {
    return (
        <div>
            <div className="nav">
                <NavigationComponent path="/" title="Home" uppercase />
                <NavigationComponent path="/contests" title="Contests" uppercase />
                <NavigationComponent path="/problemsets" title="Problemsets" uppercase />
            </div>
            <div className="nav-dropdown">
                <Dropdown trigger={<Icon><BsFillGrid3X3GapFill /></Icon>} drop="center">
                    <DropdownComponent title="Home" icon={<AiFillHome />} />
                    <DropdownComponent title="Contests" icon={<AiFillTrophy />} />
                    <DropdownComponent title="Problemsets" icon={<IoNewspaperOutline />} />
                </Dropdown>
            </div>

        </div>

    )
}
export default Navigation