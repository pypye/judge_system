function QuickSubmit() {
    return (
        <form>
            <div className="text-heading">Nộp bài từ file</div>
            <input type="file" className="choose-file" accept=".cpp, .c, .java, .pas, .py" />
            <p className="dropdown-component-annotation">
                Tên file: [ID bài].[extension]<br></br>
                Kích thước tối đa: 1MB
            </p>
            <div><button type="submit" className="btn-submit">Nộp bài</button></div>
        </form>
    )
}
export default QuickSubmit