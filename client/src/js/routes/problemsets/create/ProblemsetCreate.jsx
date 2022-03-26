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
import Axios from 'axios'
import { useParams } from 'react-router-dom'

function ProblemsetCreate(props) {
    const { id } = useParams()
    const [info, setInfo] = React.useState({
        problem_code: '',
        problem_name: '',
        level: '',
        description: { example: [], statement_main: "", statement_note: "" },
        file_input: 'stdin',
        file_output: 'stdout',
        limit_time: 1000,
        limit_memory: 256,
        tests: null
    });


    React.useEffect(() => {
        document.title = "Problemset - Add"
        if (props.edit) {
            Axios.get(`http://localhost:3001/problem?problem_code=${id}`, { withCredentials: true }).then(res => {
                setInfo(res.data)
            })
        }
    }, [props.edit, id])

    return (
        <ProblemsetInfoContext.Provider value={{ info, setInfo }}>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        <form>
                            <General  edit={props.edit}/>
                            <Statement />
                            <Publish edit={props.edit}/>
                        </form>

                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </ProblemsetInfoContext.Provider>
    )
}
export default ProblemsetCreate

