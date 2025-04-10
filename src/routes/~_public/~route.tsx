import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "antd";
import styled from "styled-components";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

const { Content } = Layout;

function RouteComponent() {
  return (
    <StyledLayout>
      <Layout>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  margin: 0 16px;
`;
