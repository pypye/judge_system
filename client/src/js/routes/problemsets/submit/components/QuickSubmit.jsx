function QuickSubmit() {
    return (
        <form>
            <div className="text-heading">Submit solution from file</div>
            <input type="file" className="choose-file" accept=".cpp, .c, .java, .pas, .py" required/>
            <p className="text-annotation">
                File name: [Problem ID].[extension]<br></br>
                Max size: 1MB
            </p>
            <div><button type="submit" className="btn-submit">Submit</button></div>
        </form>
    )
}
export default QuickSubmit