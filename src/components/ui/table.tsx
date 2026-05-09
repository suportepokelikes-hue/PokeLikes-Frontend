import type { CSSProperties, ReactNode } from 'react';

type DataTableProps = {
  columns: string[];
  children: ReactNode;
  className?: string;
  minWidth?: string;
  tableClassName?: string;
};

export function DataTable({ columns, children, className, minWidth, tableClassName }: DataTableProps) {
  const shellClassName = ['table-shell', className].filter(Boolean).join(' ');
  const tableClassNames = ['data-table', tableClassName].filter(Boolean).join(' ');
  const style = minWidth ? ({ '--data-table-min-width': minWidth } as CSSProperties) : undefined;

  return (
    <div className={shellClassName} style={style}>
      <table className={tableClassNames}>
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
