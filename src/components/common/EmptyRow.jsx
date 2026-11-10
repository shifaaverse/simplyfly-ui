function EmptyRow({ cols, text = 'No records found' }) {
    return (
        <tr>
            <td colSpan={cols} className="text-center text-muted py-4">{text}</td>
        </tr>
    )
}

export default EmptyRow
