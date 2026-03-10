import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table';

interface GenericAutoTableProps {
  data: any[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onRowClick?: (row: any) => void;
}

const parseIfJson = (val: any) => {
  if (typeof val !== 'string') return val;
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === 'object' ? parsed : val;
  } catch {
    return val;
  }
};

const RecursiveCell = ({ value }: { value: any }) => {
  const data = parseIfJson(value);

  if (Array.isArray(data)) {
    return (
      <div className="pl-4 border-l-2 border-white/20 bg-black/50 overflow-x-auto">
        <GenericAutoTable data={data} />
      </div>
    );
  }

  if (data !== null && typeof data === 'object') {
    return (
      <table className="text-xs w-full border-collapse">
        <tbody>
          {Object.entries(data).map(([k, v]) => (
            <tr key={k} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="font-bold pr-3 py-2 text-white/50 align-top text-left">{k}</td>
              <td className="py-2"><RecursiveCell value={v} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <span className="text-white/80">{String(data)}</span>;
};

export function GenericAutoTable(props: GenericAutoTableProps) {
  let data = props.data;
  let sorting = props.sorting;
  let onSortingChange = props.onSortingChange;

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const columnHelper = createColumnHelper<any>();

    const allKeys = Array.from(
      new Set(data.flatMap((obj) => Object.keys(obj)))
    );

    return allKeys.map((key) =>
      columnHelper.accessor(key, {
        header: key,
        cell: (info) => <RecursiveCell value={info.getValue()} />,
      })
    );
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
    },
    onSortingChange: onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-white/40 uppercase tracking-widest">
        No data
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b-2 border-white/10 bg-white/5">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-3 text-left text-xs font-bold text-white/60 uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors select-none border-r border-white/5 last:border-r-0"
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="text-white/30 text-xs">
                      {header.column.getIsSorted() === 'asc' && '↑'}
                      {header.column.getIsSorted() === 'desc' && '↓'}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              onClick={() => props.onRowClick?.(row.original)}
              className={`border-b border-white/5 transition-colors hover:bg-white/5 cursor-pointer ${idx % 2 === 0 ? 'bg-white/2' : 'bg-black'
                }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-white/80 min-w-[140px] align-top text-xs border-r border-white/5 last:border-r-0 font-mono"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
