type DataTableProps = {
  columns: string[];
  children: React.ReactNode;
};

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <div className="table-fade" aria-hidden="true" />
    </div>
  );
}
