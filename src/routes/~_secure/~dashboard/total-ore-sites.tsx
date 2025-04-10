import { Statistic } from "antd";
import { Acquisition } from "../../../types";
import { StyledCard } from "./dashboard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

/**
 * Total Ore Sites component.
 * Displays the total number of ore sites in acquisitions.
 * @param {Acquisition[]} data - Array of acquisition data.
 * @param {Acquisition[]} previousData - Array of previous acquisition data.
 */
const TotalOreSites = ({
  data,
  previousData,
}: {
  data: Acquisition[];
  previousData: Acquisition[];
}) => {
  const getSites = (data: Acquisition[]) => {
    return data.reduce((acc, curr) => acc + curr.ore_sites, 0);
  };
  const totalSites = getSites(data);
  const previousSites = getSites(previousData);
  const isDecreased = previousSites > totalSites;

  return (
    <StyledCard title="Total Ore Sites">
      {data.length > 0 ? (
        <>
          <Statistic
            title="Total Ore Sites"
            value={
              data.length > 0 ? totalSites : "No data available to display."
            }
            valueStyle={{
              color:
                previousData.length === 0
                  ? "#1668dc"
                  : isDecreased
                    ? "#cf1322"
                    : "#3f8600",
            }}
            prefix={
              previousData.length === 0 ? undefined : isDecreased ? (
                <ArrowDownOutlined />
              ) : (
                <ArrowUpOutlined />
              )
            }
          />
          {previousData.length > 0 && (
            <Statistic
              title="Previous Period"
              value={previousSites}
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
export default TotalOreSites;
