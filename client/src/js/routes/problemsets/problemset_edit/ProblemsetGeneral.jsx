import GeneralRow from './components/GeneralRow'
import React from 'react'
function ProblemsetGeneral() {

    return (
        <form>
            <div className="text-heading">General info</div>
            <table>
                <tbody>
                    <GeneralRow title="Name" type='name' />
                    <GeneralRow title="Input file" type='input_file' annotation='Input file name or "stdin" for standard input' />
                    <GeneralRow title="Output file" type='output_file' annotation='Output file name or "stdout" for standard output' />
                    <GeneralRow title="Time limit" type='time_limit' annotation='Time limit per test (between 250 ms and 15000 ms)' ext="ms" />
                    <GeneralRow title="Memory limit" type='memory_limit' annotation='Memory limit (between 4 MB and 1024 MB)' ext="MB" />
                </tbody>
            </table>
            <button type="submit" className="btn-submit">Save changes</button>
        </form>
    )
}
export default ProblemsetGeneral