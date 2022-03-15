import React from 'react'
import Content from "../../../components/contents/Content"
import Header from "../../../components/headers/Header"
import SubNavigation from "../../../components/headers/SubNavigation"
import LeftSide from "../../../components/contents/LeftSide"
import LeftSideComponent from "../../../components/contents/LeftSideComponent"
import RightSide from "../../../components/contents/RightSide"
import RightSideComponent from "../../../components/contents/RightSideComponent"
import NavigationLeftSide from '../../../components/headers/NagivationLeftSide'

import ProblemsetStatement from './ProblemsetStatement'
import ProblemsetGeneral from './ProblemsetGeneral'
import ProblemsetTests from './ProblemsetTests'
import ProblemsetPublish from './ProblemsetPublish'
import { ProblemsetInfoContext } from '../../../context'

function ProblemsetEdit() {
    const [tab, setTab] = React.useState(1)
    const [info, setInfo] = React.useState({
        name: '',
        input_file: 'stdin',
        output_file: 'stdout',
        pdf: true,
        statement: {},
        time_limit: 1000,
        memory_limit: 256
    });

    const onTabClick = (value) => {
        setTab(value)
    }

    React.useEffect(() => {
        document.title = "Problemset - Add"
    })

    return (
        <ProblemsetInfoContext.Provider value={{ info, setInfo }}>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide width="20%">
                    <LeftSideComponent>
                        <NavigationLeftSide onClick={() => onTabClick(1)} title='General info' />
                        <NavigationLeftSide onClick={() => onTabClick(2)} title='Statement' />
                        <NavigationLeftSide onClick={() => onTabClick(3)} title='Tests/Checkers' />
                        <NavigationLeftSide onClick={() => onTabClick(4)} title='Publish' />
                    </LeftSideComponent>
                </LeftSide>
                <RightSide width="80%">
                    <RightSideComponent>
                        {(tab === 1) && <ProblemsetGeneral />}
                        {(tab === 2) && <ProblemsetStatement />}
                        {(tab === 3) && <ProblemsetTests />}
                        {(tab === 4) && <ProblemsetPublish />}
                    </RightSideComponent>
                </RightSide>
            </Content>
        </ProblemsetInfoContext.Provider>
    )
}
export default ProblemsetEdit

