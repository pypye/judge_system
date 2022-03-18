import React from 'react'
import Content from "../../../components/contents/Content"
import Header from "../../../components/headers/Header"
import LeftSide from "../../../components/contents/LeftSide"
import LeftSideComponent from "../../../components/contents/LeftSideComponent"

import Statement from './contents/Statement'
import General from './contents/General'
import Publish from './contents/Publish'
import { ProblemsetInfoContext } from '../../../context'
import SubNavigation from '../../../components/headers/SubNavigation'

function ProblemsetEdit() {
    const [info, setInfo] = React.useState({
        name: '',
        file_input: 'stdin',
        file_output: 'stdout',
        example: [],
        limit_time: 1000,
        limit_memory: 256
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
                        <form>
                            <General />
                            <Statement />
                            <Publish />
                        </form>

                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </ProblemsetInfoContext.Provider>
    )
}
export default ProblemsetEdit

