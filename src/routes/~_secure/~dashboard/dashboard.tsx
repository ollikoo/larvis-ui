import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/use-auth";
import { Acquisition, Timeframe } from "../../../types";
import { getAcquisitions } from "../../../services/api";
import { App, Card, Flex, Layout, Select, Typography } from "antd";
import { LoadingText } from "../~users/users-table";
import styled from "styled-components";
import Histogram from "./histogram";
import { breakpoints } from "../../../utils/breakpoints";
import TotalAcquisitions from "./total-acquisitions";
import AverageOreSites from "./average-ore-sites";
import TotalOreSites from "./total-ore-sites";
import AcquisitionsTable from "./acquisitions-table";

/**
 * Dashboard page.
 * Displays the dashboard with various statistics and charts.
 * It fetches Acquisition data from the API and allows filtering by timeframe.
 */
const Dashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Acquisition[]>([]);
  const [filteredData, setFilteredData] = useState<Acquisition[]>([]);
  const [previousData, setPreviousData] = useState<Acquisition[]>([]);
  const { notification } = App.useApp();
  const [timeframe, setTimeframe] = useState<Timeframe>("last_24h");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }

      setLoading(true);

      try {
        const response = await getAcquisitions(token);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching acquisitions:", error);

        notification.error({
          message: "An error occurred. Please try again later.",
          placement: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notification, token]);

  // Filter data based on the selected timeframe
  useEffect(() => {
    // Get the current time in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Filter data for the current and previous periods based on the selected timeframe
    const filterDataByTimeframe = () => {
      if (timeframe === "all_time") {
        // For "all_time", show all data and set previousData to empty (no trend to calculate)
        return { current: data, previous: [] };
      }

      let periodDuration: number; // Duration of the period in seconds

      switch (timeframe) {
        case "last_24h":
          periodDuration = 24 * 60 * 60;
          break;
        case "last_7d":
          periodDuration = 7 * 24 * 60 * 60;
          break;
        case "last_30d":
          periodDuration = 30 * 24 * 60 * 60;
          break;
        default:
          return { current: data, previous: [] };
      }

      // Calculate the start and end timestamps for the current and previous periods
      const currentThreshold = currentTimestamp - periodDuration; // Start of the current period (e.g. now-24h for "last_24h")
      const previousThreshold = currentTimestamp - 2 * periodDuration; // Start of the previous period (e.g. 24h-48h for "last_24h")

      // Filter data for the current period (e.g. from now to 24 hours ago)
      const currentPeriodData = data.filter(
        (acquisition) =>
          acquisition.timestamp >= currentThreshold &&
          acquisition.timestamp <= currentTimestamp,
      );

      // Filter data for the previous period (e.g. from 24h ago to 48h ago)
      const previousPeriodData = data.filter(
        (acquisition) =>
          acquisition.timestamp >= previousThreshold &&
          acquisition.timestamp < currentThreshold,
      );

      return { current: currentPeriodData, previous: previousPeriodData };
    };

    const { current, previous } = filterDataByTimeframe();
    setFilteredData(current);
    setPreviousData(previous);
  }, [data, timeframe]);

  // TODO: Add a proper loading state
  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <StyledLayout>
      <Flex justify="space-between" align="center">
        <Typography.Title>Dashboard</Typography.Title>
        <Select<Timeframe>
          defaultValue={timeframe}
          style={{ width: 120 }}
          onChange={(value) => setTimeframe(value)}
          options={[
            { value: "all_time", label: "All time" },
            { value: "last_24h", label: "Last 24 hours" },
            { value: "last_7d", label: "Last 7 days" },
            { value: "last_30d", label: "Last 30 days" },
            { value: "custom", label: "Custom", disabled: true },
          ]}
        />
      </Flex>
      <CardGrid>
        <Histogram data={filteredData} />
        <InnerGrid>
          <TotalAcquisitions data={filteredData} previousData={previousData} />
          <AverageOreSites data={filteredData} previousData={previousData} />
          <TotalOreSites data={filteredData} previousData={previousData} />
        </InnerGrid>
      </CardGrid>
      <CardGrid>
        <AcquisitionsTable data={filteredData} />
      </CardGrid>
    </StyledLayout>
  );
};

export default Dashboard;

const StyledLayout = styled(Layout)`
  max-width: 100%;
  width: 1200px;
  margin: 0 auto;
  container-type: inline-size;
`;

const CardGrid = styled(Flex)`
  gap: 16px;
  flex-wrap: wrap;
  flex-direction: column;
  position: relative;

  @container (min-width: ${breakpoints.md}px) {
    flex-direction: row;
  }

  & + & {
    margin-top: 16px;
  }

  &:last-of-type {
    margin-bottom: 64px;
  }
`;

export const StyledCard = styled(Card)<{ $fullWidth?: boolean }>`
  width: 100%;

  @container (min-width: ${breakpoints.md}px) {
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "calc(50% - 16px)")};
  }
`;

const InnerGrid = styled(Flex)`
  gap: 16px;
  flex-wrap: wrap;
  flex-direction: column;
  position: relative;
  width: 100%;

  @container (min-width: ${breakpoints.md}px) {
    flex-direction: row;
    width: 50%;

    ${StyledCard} {
      width: calc(50% - 8px);
    }
  }
`;
