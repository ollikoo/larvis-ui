import { useEffect, useState } from "react";
import { App, Button, Form, Input, Layout, Typography } from "antd";
import styled from "styled-components";
import { useAuth } from "../../../hooks/use-auth";
import { LoadingText } from "./users-table";
import { User as UserType } from "../../../types";
import { getUser, updateUser } from "../../../services/api";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";

/**
 * User view. Displays user details and allows editing for the current user.
 */
const User = () => {
  const { token, user: currentUser } = useAuth();
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();
  const { userId } = useParams({ from: "/_secure/users/$userId" });
  const navigate = useNavigate();
  const isCurrentUser = currentUser?.user_id === userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }

      setLoading(true);

      try {
        const response = await getUser(userId, token);
        setUser(response.data);
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
  }, [notification, token, userId]);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    if (!token || !isCurrentUser) {
      return;
    }

    try {
      const response = await updateUser(userId, values, token);

      setUser(response.data);

      const user: UserType = {
        user_id: response.data.user_id,
        name: response.data.name,
      };

      window.sessionStorage.setItem("token", token);
      window.sessionStorage.setItem("user", JSON.stringify(user));

      notification.success({
        message: "User updated successfully",
        placement: "bottom",
      });
    } catch (error) {
      console.error("Error updating user: ", error);

      notification.error({
        message: "An error occurred. Please try again later.",
        placement: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // TODO: Add a proper loading state
  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <>
      <BackButton
        type="text"
        onClick={() => navigate({ to: "/users" })}
        icon={<ArrowLeftOutlined />}
      >
        Users
      </BackButton>

      <StyledLayout>
        <Typography.Title>
          {user?.name !== "" ? user?.name : user.user_id}
        </Typography.Title>

        {user && (
          <Form
            onFinish={onFinish}
            initialValues={{
              username: user?.user_id,
              name: user?.name,
              password: user?.password,
            }}
            layout="vertical"
          >
            <Form.Item name="username">
              <Input placeholder="Username" disabled />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Name" disabled={!isCurrentUser} />
            </Form.Item>
            {user?.password && ( // TODO: Remove this password handling :D
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  value={user?.password}
                  disabled={!isCurrentUser}
                />
              </Form.Item>
            )}
            {isCurrentUser && (
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Save
              </Button>
            )}
          </Form>
        )}
      </StyledLayout>
    </>
  );
};

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  max-width: 100%;
  width: 640px;
  margin: 0 auto;
`;

export default User;

const BackButton = styled(Button)`
  margin-top: 0.67em;
`;
