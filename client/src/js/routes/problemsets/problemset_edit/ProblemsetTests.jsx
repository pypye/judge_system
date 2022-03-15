function ProblemsetTests() {
    return (
        <div className="flex-vertical">
            <div>
                <div className="text-heading">Tests</div>
                <input type="file" className="choose-file" />
            </div>
            <div>
                <div className="text-heading">Checkers</div>
                <input type="file" className="choose-file" />
            </div>
            <button type="submit" className="btn-submit">Save changes</button>
        </div>
    )
}
export default ProblemsetTests