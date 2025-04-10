import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "./contexts/auth-context-provider.tsx";

const px2rem = px2remTransformer({
  rootValue: 16,
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: #000;
  }
`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider transformers={[px2rem]}>
      <AuthProvider>
        <GlobalStyle />
        <ConfigProvider // TODO: add proper theme configuration
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </AuthProvider>
    </StyleProvider>
  </StrictMode>,
);
