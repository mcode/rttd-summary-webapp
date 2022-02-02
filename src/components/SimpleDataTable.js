function SimpleDataTable({ data = {}, title, className }) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return (
    <table
      className={`table-fixed max-w-screen-xl border text-left ${className}`}
    >
      <thead className="border-b bg-slate-200">
        <tr>
          <th
            scope="col"
            className="w-48 px-6 py-3 text-sm font-medium text-gray-900 break-normal"
          >
            {title}
          </th>
          <th scope="col" className="w-96"></th>
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => {
          return (
            <tr
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              key={`${keys[i]}-${v}`}
            >
              <td className="w-48 px-6 py-3 text-sm font-medium text-gray-900 break-normal">
                {keys[i]}
              </td>
              <td className="w-96 px-6 py-3 text-sm font-light text-gray-900 break-normal">
                {v}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default SimpleDataTable;
