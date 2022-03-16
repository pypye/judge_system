import React from 'react'
import Content from "../../../components/contents/Content"
import Header from "../../../components/headers/Header"
import LeftSide from "../../../components/contents/LeftSide"
import LeftSideComponent from "../../../components/contents/LeftSideComponent"

import ProblemsetStatement from './contents/Statement'
import ProblemsetGeneral from './contents/General'
import ProblemsetTests from './contents/Tests'
import ProblemsetPublish from './contents/Publish'
import { ProblemsetInfoContext } from '../../../context'
import SubNavigation from '../../../components/headers/SubNavigation'

function ProblemsetEdit() {
    const [info, setInfo] = React.useState({
        name: '',
        input_file: 'stdin',
        output_file: 'stdout',
        pdf: true,
        statement: {},
        time_limit: 1000,
        memory_limit: 256
    });


    React.useEffect(() => {
        document.title = "Problemset - Add"
    })

    return (
        <ProblemsetInfoContext.Provider value={{ info, setInfo }}>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        <ProblemsetGeneral />
                        <ProblemsetStatement />
                        <ProblemsetTests />
                        <ProblemsetPublish />
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </ProblemsetInfoContext.Provider>
    )
}
export default ProblemsetEdit

