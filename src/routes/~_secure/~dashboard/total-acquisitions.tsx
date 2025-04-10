import { Statistic } from "antd";
import { Acquisition } from "../../../types";
import { StyledCard } from "./dashboard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

/**
 * Total Acquisitions component.
 * Displays the total number of acquisitions.
 * @param {Acquisition[]} data - Array of acquisition data.
 * @param {Acquisition[]} previousData - Array of previous acquisition data.
 */
const TotalAcquisitions = ({
  data,
  previousData,
}: {
  data: Acquisition[];
  previousData: Acquisition[];
}) => {
  return (
    <StyledCard title="Total Acquisitions">
      {data.length > 0 ? (
        <>
          <Statistic
            title="Total Acquisitions"
            value={data.length}
            valueStyle={{
              color:
                previousData.length === 0
                  ? "#1668dc"
                  : previousData.length > data.length
                    ? "#cf1322"
                    : "#3f8600",
            }}
            prefix={
              previousData.length === 0 ? undefined : previousData.length >
                data.length ? (
                <ArrowDownOutlined />
              ) : (
                <ArrowUpOutlined />
              )
            }
          />
          {previousData.length > 0 && (
            <Statistic
              title="Previous Period"
              value={previousData.length}
              valueStyle={{ color: "#1668dc" }}
              style={{ marginTop: 16 }}
            />
          )}
        </>
      ) : (
        <p>No data available to display.</p>
      )}
    </StyledCard>
  );
};
export default TotalAcquisitions;
