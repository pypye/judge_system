import GeneralInfo from '../components/GeneralInfo'
import React from 'react'
function General(props) {

    return (
        <React.Fragment>
            <div className="text-heading">General info</div>
            <table>
                <tbody>
                    <GeneralInfo title="Problem ID" type='problem_code' annotation="Number, alphabet character, and underscore only" no_edit={props.edit}/>
                    <GeneralInfo title="Problem name" type='problem_name' />

                    <GeneralInfo title="Input file" type='file_input' annotation='Input file name or "stdin" for standard input' />
                    <GeneralInfo title="Output file" type='file_output' annotation='Output file name or "stdout" for standard output' />

                    <GeneralInfo title="Time limit" type='limit_time' annotation='Time limit per test (between 250 ms and 15000 ms)' ext="ms" />
                    <GeneralInfo title="Memory limit" type='limit_memory' annotation='Memory limit per test (between 4 MB and 1024 MB)' ext="MB" />
                </tbody>
            </table>
        </React.Fragment>
    )
}
export default General