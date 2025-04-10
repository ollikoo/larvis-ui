import { Statistic } from "antd";
import { Acquisition } from "../../../types";
import { StyledCard } from "./dashboard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

/**
 * Average Ore Sites component.
 * Displays the average number of ore sites in acquisitions.
 * @param {Acquisition[]} data - Array of acquisition data.
 * @param {Acquisition[]} previousData - Array of previous acquisition data.
 */
const AverageOreSites = ({
  data,
  previousData,
}: {
  data: Acquisition[];
  previousData: Acquisition[];
}) => {
  const getOreSites = (data: Acquisition[]) => {
    return data.reduce((acc, curr) => acc + curr.ore_sites, 0) / data.length;
  };

  const sites = getOreSites(data);
  const previousSites = getOreSites(previousData);
  const isDecreased = previousSites > sites;

  return (
    <StyledCard title="Average Ore Sites">
      {data.length > 0 ? (
        <>
          <Statistic
            title="Per Acquisition"
            value={data.length > 0 ? sites : "No data available to display."}
            valueStyle={{
              color:
                previousData.length === 0
                  ? "#1668dc"
                  : isDecreased
                    ? "#cf1322"
                    : "#3f8600",
            }}
            precision={2}
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
              value={getOreSites(previousData)}
              valueStyle={{ color: "#1668dc" }}
              style={{ marginTop: 16 }}
              precision={2}
            />
          )}
        </>
      ) : (
        <p>No data available to display.</p>
      )}
    </StyledCard>
  );
};
export default AverageOreSites;
