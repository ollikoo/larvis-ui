import { useEffect, useState } from "react";
import { App, Button, Layout, Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { User } from "../../../types";
import { getUsers } from "../../../services/api";
import { useAuth } from "../../../hooks/use-auth";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate, UseNavigateResult } from "@tanstack/react-router";
import styled from "styled-components";

const getColumns = (
  navigate: UseNavigateResult<string>,
): TableProps<User>["columns"] => [
  {
    title: "ID",
    dataIndex: "user_id",
    key: "user_id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "",
    key: "action",
    width: 1,
    render: (_, record) => (
      <Space size="middle">
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate({ to: `/users/${record.user_id}` })}
          aria-label={`View user ${record.name}`}
        >
          View
        </Button>
      </Space>
    ),
  },
];

/**
 * Users table. Displays a list of users with their details.
 */
const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const { token } = useAuth();
  const { notification } = App.useApp();
  const navigate = useNavigate();

  const columns = getColumns(navigate);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }

      setLoading(true);

      try {
        const response = await getUsers(token);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);

        notification.error({
          message: "An error occurred. Please try again later",
          placement: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notification, token]);

  // TODO: Add a proper loading state
  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <StyledLayout>
      <Typography.Title>Users</Typography.Title>
      <TableWrap>
        <Table<User>
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.user_id }))}
        />
      </TableWrap>
    </StyledLayout>
  );
};

export default UsersTable;

export const LoadingText = styled(Typography.Paragraph)`
  margin-top: 0.67em;
`;

const StyledLayout = styled(Layout)`
  max-width: 100%;
  width: 1200px;
  margin: 0 auto;
`;

const TableWrap = styled.div`
  margin-bottom: 64px;
`;
