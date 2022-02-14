function TableHeader({ isFirstCol, text }) {
  return (
    <>
      <th
        scope="col"
        className={`px-6 py-3 text-sm font-medium text-gray-900 `}
        style={{
          wordBreak: "break-word",
          minWidth: isFirstCol ? "10rem" : "20rem",
        }}
      >
        {text}
      </th>
    </>
  );
}

export default TableHeader;
