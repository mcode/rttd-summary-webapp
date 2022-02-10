function TableHeader({ isFirstCol, text }) {
  return (
    <>
      <th
        scope="col"
        className={`${
          isFirstCol ? "!w-48" : "!w-96"
        } px-6 py-3 text-sm font-medium text-gray-900 `}
        style={{
          wordBreak: "break-word",
          minWidth: isFirstCol ? "12rem" : "24rem",
        }}
      >
        {text}
      </th>
    </>
  );
}

export default TableHeader;
