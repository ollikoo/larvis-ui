import { Table, type TableProps } from "antd";
import { Acquisition } from "../../../types";
import { StyledCard } from "./dashboard";

const getColumns = (): TableProps<Acquisition>["columns"] => [
  {
    title: "Time",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (text) => {
      const date = new Date(text * 1000);
      const offset = date.getTimezoneOffset() / -60;
      const formattedOffset = `UTC${offset >= 0 ? "+" : ""}${offset}`;
      return `${date.toLocaleString()} (${formattedOffset})`;
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => a.timestamp - b.timestamp,
    width: "40%",
  },
  {
    title: "Ore Sites",
    dataIndex: "ore_sites",
    key: "ore_sites",
  },
];

/**
 * Acquisitions table. Displays a list of acquisitions with their details.
 */
const AcquisitionsTable = ({ data }: { data: Acquisition[] }) => {
  const columns = getColumns();

  return (
    <StyledCard title="Acquisitions History" $fullWidth>
      {data.length > 0 ? (
        <>
          <Table<Acquisition>
            columns={columns}
            dataSource={data.map((item) => ({ ...item, key: item.timestamp }))}
          />
        </>
      ) : (
        <p>No data available to display.</p>
      )}
    </StyledCard>
  );
};

export default AcquisitionsTable;
