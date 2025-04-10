import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import backgroundImage from "../assets/satellite-constellation.webp";
import styled from "styled-components";
import { Button, Flex, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

type Context = {
  isAuthenticated: boolean;
};

export const Route = createRootRouteWithContext<Context>()({
  component: Root,
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <NotFound isError />,
});

function Root() {
  return <Outlet />;
}

/**
 * View for the not found and error pages.
 * Displays a message and a button to go back to the home page.
 */
function NotFound({ isError }: { isError?: boolean }) {
  const navigate = useNavigate();

  return (
    <Container justify="center" align="center">
      <BG />
      <InnerWrapper vertical align="center">
        <Title level={1}>{isError ? "Oops!" : "There's nothing here"}</Title>
        <Text>
          {isError
            ? "Something went wrong"
            : "Either this page doesn't exist or you don't have the necessary rights to access it"}
        </Text>
        <Button
          icon={<ArrowLeftOutlined />}
          type="primary"
          onClick={() => navigate({ to: "/" })}
        >
          Back to Home
        </Button>
      </InnerWrapper>
    </Container>
  );
}

const Container = styled(Flex)`
  height: 100vh;
  width: 100vw;
  max-width: 100%;
`;

const BG = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: brightness(50%) blur(5px);
`;

const InnerWrapper = styled(Flex)`
  position: relative;
  max-width: 100%;
  padding: 0 16px;
`;

const Title = styled(Typography.Title)`
  margin-top: 16px;
  margin-bottom: 24px !important;
  text-align: center;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;

const Text = styled(Typography.Text)`
  text-align: center;
  margin-bottom: 24px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;
