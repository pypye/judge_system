import React from "react"

function ProblemsetAdd() {
    const [problem, setProblem] = React.useState("")

    const onCreateProblem = (event) => {
        event.preventDefault()
        console.log({ problem: problem })
    }
    return (
        <div>
            <div className="text-heading">Create new problem</div>
            <form className='flex-vertical' style={{ alignItems: "center" }} onSubmit={onCreateProblem}>
                <div className='flex-horizontal'>
                    <div>Name</div>
                    <input className="text-input" type="text" value={problem} onChange={(e) => setProblem(e.target.value)} autoComplete='true' required />
                </div>
                <button type="submit" className="btn-submit">Create</button>
            </form>
        </div>

    )
}
export default ProblemsetAdd