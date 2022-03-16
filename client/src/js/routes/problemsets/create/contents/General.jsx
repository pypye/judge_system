import Cell from '../components/Cell'
import React from 'react'
function ProblemsetGeneral() {

    return (
        <div>
            <div className="text-heading">General info</div>
            <table>
                <tbody>
                   
                    <Cell title="Name" type='name' />
            
                    <Cell title="Input file" type='input_file' annotation='Input file name or "stdin" for standard input' />
                    <Cell title="Output file" type='output_file' annotation='Output file name or "stdout" for standard output' />
                
                    <Cell title="Time limit" type='time_limit' annotation='Time limit per test (between 250 ms and 15000 ms)' ext="ms" />
                    <Cell title="Memory limit" type='memory_limit' annotation='Memory limit (between 4 MB and 1024 MB)' ext="MB" />
                    

                </tbody>
            </table>
        </div>
    )
}
export default ProblemsetGeneral