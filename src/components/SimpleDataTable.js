function SimpleDataTable({ data = {}, title, className }) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return (
    <table className={`table-auto border text-left max-w-md ${className}`}>
      <thead className="border-b bg-slate-200">
        <tr>
          <th className="text-sm font-medium text-gray-900 px-6 py-3 text-left">
            {title}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => {
          return (
            <tr
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              key={`${keys[i]}-${v}`}
            >
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {keys[i]}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-3 whitespace-nowrap">
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
