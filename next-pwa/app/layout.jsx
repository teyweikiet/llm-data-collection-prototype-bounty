import "normalize.css/normalize.css";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Inter } from "next/font/google";

import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./hooks/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Language Exchange App",
  description:
    "A language exchange app as submission for Stack Up's Data Collection Prototype Bounty",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={inter.className} style={{ height: "100dvh" }}>
        <MantineProvider defaultColorScheme="dark">
          <AuthProvider>
            <Container size="65rem" px="s" h="calc(100% - 60px)">
              <Navbar />
              <Container px="md" h="100%">
                {children}
              </Container>
            </Container>
            <Notifications />
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
