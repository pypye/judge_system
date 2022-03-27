import React from 'react'
import Content from "../../../components/contents/Content"
import Header from "../../../components/headers/Header"
import SubNavigation from "../../../components/headers/SubNavigation"
import LeftSide from "../../../components/contents/LeftSide"
import LeftSideComponent from "../../../components/contents/LeftSideComponent"
import RightSide from "../../../components/contents/RightSide"
import RightSideComponent from "../../../components/contents/RightSideComponent"

import Submit from './components/Submit'
import QuickSubmit from './components/QuickSubmit'

function ProblemsetSubmit() {
    React.useEffect(() => {
        document.title = "Problemset - Submit"
    })

    return (
        <div>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide>
                    <LeftSideComponent>
                        <Submit />
                    </LeftSideComponent>
                </LeftSide>
                <RightSide width="25%">
                    <RightSideComponent>
                        <QuickSubmit />
                    </RightSideComponent>
                </RightSide>
            </Content>
        </div>

    )
}
export default ProblemsetSubmit