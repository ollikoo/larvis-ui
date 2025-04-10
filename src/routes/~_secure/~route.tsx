import { createElement, useState } from "react";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import {
  App,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  MenuProps,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo-icon.png";
import styled from "styled-components";
import { useAuth } from "../../hooks/use-auth";
import { useBreakpoint } from "../../hooks/use-breakpoint";

export const Route = createFileRoute("/_secure")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    // Check if the user is authenticated
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

function RouteComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { setAuth, user } = useAuth();
  const { notification } = App.useApp();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const isMobile = ["xs", "md"].includes(breakpoint);

  const logOut = () => {
    try {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
      setAuth(null, null);
      notification.success({
        message: "Logout successful",
        placement: "bottom",
      });
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: createElement(BarChartOutlined),
      label: "Dashboard",
      onClick: () => navigate({ to: "/dashboard" }),
    },
    {
      key: "/users",
      icon: createElement(TeamOutlined),
      label: "Users",
      onClick: () => navigate({ to: "/users" }),
    },
  ];

  const getActiveMenuKey = (): string[] => {
    return [
      items.find((item) => {
        return location.pathname.startsWith((item?.key ?? "") as string);
      })?.key as string,
    ];
  };

  const userMenuItems: MenuProps["items"] = [
    {
      label: "User settings",
      key: "1",
      icon: <SettingOutlined />,
      onClick: () => {
        navigate({ to: `/users/${user?.user_id}` });
      },
    },
    {
      type: "divider" as const,
    },
    {
      label: "Log out",
      key: "2",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => logOut(),
    },
  ];

  return (
    <Layout hasSider={!isMobile}>
      {!isMobile && (
        <StyledSider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <LogoContainer
            align="center"
            justify={collapsed ? "center" : "start"}
          >
            <Logo src={logo} alt="logo" $collapsed={collapsed} />
            {!collapsed && <StyledText ellipsis>LARVIS</StyledText>}
          </LogoContainer>

          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            selectedKeys={getActiveMenuKey()}
          />
        </StyledSider>
      )}
      <Layout>
        <StyledHeader $isMobile={isMobile}>
          {isMobile ? (
            <>
              <Logo
                src={logo}
                alt="logo"
                $collapsed={collapsed}
                onClick={() => navigate({ to: "/" })}
                tabIndex={0}
                role="button"
              />
              <Dropdown
                menu={{
                  items: [...items, ...userMenuItems],
                }}
                arrow
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  shape="circle"
                  aria-label="Toggle menu"
                />
              </Dropdown>
            </>
          ) : (
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              arrow
              placement="bottomRight"
            >
              <Button
                type="primary"
                icon={<UserOutlined />}
                shape="circle"
                aria-label="User menu"
              />
            </Dropdown>
          )}
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </Layout>
  );
}

const Logo = styled.img<{ $collapsed: boolean }>`
  margin: ${({ $collapsed }) => ($collapsed ? "16px 32px" : "16px 8px")};
  width: auto;
  height: calc(100% - 32px);
`;

const StyledContent = styled(Content)`
  margin: 0 16px;
`;

const StyledText = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;

const StyledHeader = styled(Header)<{ $isMobile: boolean }>`
  display: flex;
  justify-content: ${({ $isMobile }) =>
    $isMobile ? "space-between" : "flex-end"};
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #303030;
  background-color: #000;
  z-index: 999;
  position: sticky;
  top: 0;
`;

const LogoContainer = styled(Flex)`
  height: 64px;
`;

const StyledSider = styled(Sider)`
  border-right: 1px solid #303030;
  overflow: auto;
  height: 100vh;
  position: sticky;
  top: 0;
  bottom: 0;

  .ant-layout-sider-trigger {
    border-right: 1px solid #303030;
    border-top: 1px solid #303030;
  }
`;
