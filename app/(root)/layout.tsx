import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
export const matadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application",
};
import '../globals.css'
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";
const inter=Inter({subsets: ["latin"]});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>
    <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <Topbar/>
            <main className=" flex">
            <LeftSidebar/>
            <section className="main-container">
              <div className=" w-full max-w-4xl">
                {children}
              </div>
            </section>
            <RightSidebar/>
            </main>
          <Bottombar/>
        </body>
    </html>
    </ClerkProvider>;
}
