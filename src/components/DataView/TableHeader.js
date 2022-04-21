function TableHeader({ isFirstCol, text }) {
  return (
    <>
      <th
        scope="col"
        className={`px-6 py-3 font-medium text-gray-900 ${
          isFirstCol ? "text-md" : "text-sm"
        }`}
        style={{
          wordBreak: "break-word",
          minWidth: isFirstCol ? "12rem" : "20rem",
        }}
      >
        {text}
      </th>
    </>
  );
}

export default TableHeader;
