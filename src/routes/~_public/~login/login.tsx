import { useState } from "react";
import { App, Button, Card, Flex, Form, Input, Typography } from "antd";
import { getUser, login } from "../../../services/api";
import styled from "styled-components";
import { useAuth } from "../../../hooks/use-auth";
import { User } from "../../../types";
import backgroundImage from "../../../assets/satellite-constellation.webp";
import logo from "../../../assets/logo-icon.png";
import { AxiosError } from "axios";
import { Route } from "./~index";
import { useNavigate, useRouter } from "@tanstack/react-router";

/**
 * Login page. Allows users to log in to their account.
 * Redirects to the previous page if redirect is set in the URL.
 * Otherwise, redirects to the home page.
 */
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();
  const search = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const response = await login(values.username, values.password);

      const token = response.data.access;

      const userResponse = await getUser(values.username, token);

      const user: User = {
        user_id: userResponse.data.user_id,
        name: userResponse.data.name,
      };

      setAuth(user, token);

      window.sessionStorage.setItem("token", token);
      window.sessionStorage.setItem("user", JSON.stringify(user));

      notification.success({
        message: "Log in successful",
        placement: "bottom",
      });

      router.invalidate().finally(() => {
        navigate({ to: search.redirect || "/" });
      });
    } catch (error) {
      console.error("Log in failed", error);

      let errorMessage = "An error occurred. Please try again.";

      if (error instanceof AxiosError) {
        console.error("Axios error", error.response);

        errorMessage =
          error.response?.status === 401
            ? "Invalid username or password"
            : "An error occurred. Please try again.";

        notification.error({
          message: errorMessage,
          placement: "bottom",
        });
      } else {
        notification.error({
          message: errorMessage,
          placement: "bottom",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container justify="center">
      <Background />
      <InnerWrapper vertical align="center">
        <Logo src={logo} alt="LARVIS logo" />
        <Title level={3}>LARVIS</Title>
        <StyledCard title="Log in to your account">
          <Form onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Login
            </Button>
          </Form>
        </StyledCard>
      </InnerWrapper>
    </Container>
  );
};

export default Login;

const Container = styled(Flex)`
  height: 100vh;
  width: calc(100vw - 32px);
  max-width: 100%;
  justify-content: center;
  padding-top: 160px;
`;

const Background = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: brightness(70%);
`;

const StyledCard = styled(Card)`
  width: 300px;
  max-width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const Logo = styled.img`
  width: 60px;
  height: auto;
  position: relative;
`;

const InnerWrapper = styled(Flex)`
  position: relative;
  max-width: 100%;
`;

const Title = styled(Typography.Title)`
  margin-top: 16px;
  margin-bottom: 24px !important;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;
