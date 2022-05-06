import Axios from "axios"
import React from "react"
import { useParams } from "react-router-dom"
import Content from "../../components/contents/Content"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"
import RightSide from "../../components/contents/RightSide"
import RightSideComponent from "../../components/contents/RightSideComponent"
import Header from "../../components/headers/Header"
import SubNavigation from "../../components/headers/SubNavigation"
import QuickSubmit from "./submit/components/QuickSubmit"
import MarkdownPreview from '@uiw/react-markdown-preview'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import Table from "../../components/utils/Table"
import TableRow from "../../components/utils/TableRow"
import TableCellHead from "../../components/utils/TableCellHead"
import TableCell from "../../components/utils/TableCell"

function ProblemsetShow() {
    const { id } = useParams()
    const [problem, setProblem] = React.useState({ description: { example: [] } })
    React.useEffect(() => {
        document.title = `Problem - ${id}`
        Axios.get(`http://localhost:3001/problem?problem_code=${id}`, { withCredentials: true }).then(res => {
            setProblem(res.data)
        })
    }, [id])
    return (
        <React.Fragment>
            <Header />
            <SubNavigation />
            <Content>
                <LeftSide>
                    <LeftSideComponent>

                        <div style={{ textAlign: "center" }}>
                            <h4>{problem.problem_name}</h4>
                            <div>time limit per test: {problem.limit_time} ms </div>
                            <div>memory limit per test: {problem.limit_memory} MB </div>
                            <div>input: {problem.file_input} </div>
                            <div>output: {problem.file_output} </div>
                        </div>
                        <h4>Statement</h4>
                        <MarkdownPreview remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} source={problem.description.statement_main} />
                        {
                            problem.description.example.length !== 0 && <React.Fragment>
                                <h4>Example</h4>
                                <Table>
                                    <TableRow>
                                        <TableCellHead title="Example Input" />
                                        <TableCellHead title="Example Output" />
                                    </TableRow>
                                    {
                                        problem.description.example.map((value, key) => (
                                            <React.Fragment key={key}>
                                                <TableRow>
                                                    <TableCell padding="0px 15px" align="left"><pre>{value.inp}</pre></TableCell>
                                                    <TableCell padding="0px 15px" align="left"><pre>{value.out}</pre></TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))
                                    }
                                </Table>
                            </React.Fragment>
                        }
                        {
                            (problem.description.statement_note !== null && problem.description.statement_note !== '') && <React.Fragment>
                                <h4>Note</h4>
                                <MarkdownPreview remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} source={problem.description.statement_note} />
                            </React.Fragment>
                        }

                    </LeftSideComponent>
                </LeftSide>
                <RightSide width="25%">
                    <RightSideComponent>
                        <QuickSubmit />
                    </RightSideComponent>
                </RightSide>
            </Content>
        </React.Fragment>
    )
}
export default ProblemsetShow