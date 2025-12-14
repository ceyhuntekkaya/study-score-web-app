"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/style.css";
import HeaderSidebar from "@/components/layout/header-sidebar";
import Footer from "@/components/layout/footer";
import Loading from "@/app/loading";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.roleSet.includes("LEARNER"))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  console.log("loading:", loading, "user:", user);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* <ProtectedLayout requiredRole={["ADMIN", "USER", "LEARNER"]}>
        <div className="background">
          <div className="background-top"></div>

          <Sidebar
            isOpen={false}
            onCloseAction={function (): void {
              throw new Error("Function not implemented.");
            }}
          />

          <Link href="/learner" className="logo"></Link>

          <div className="container">
            <div className="content-wrapper">
              <div className="content contentA">
                <div className="w-full flex flex-col min-h-full">
                  <Header />
                  <main className="flex-1 p-3">
                    <div className="p-1">{children}</div>
                  </main>
                  <Footer />
                </div>
              </div>
            </div>
          </div>

          <p className="bottomInfoText">Powered by NISH / © 2025 StudyScore</p>
        </div>
      </ProtectedLayout> */}

      <>
        <HeaderSidebar />

        <a href="index.html" className="logo"></a>

        <div className="custom-layout">
          <div className="content-bg" style={{ backgroundColor: "#0000003b" }}>
            <div className="custom-scrollable-content">
              <div className="h-full">{children}</div>
            </div>
            <Footer />
            <p className="content-info-bottom-text">
              Powered by NISH / © 2025 StudyScore
            </p>
          </div>

          <div className="background-top"></div>
        </div>
      </>

      {/* <ProtectedLayout requiredRole={["ADMIN", "USER", "LEARNER"]}>
        <div className="min-h-screen bg-gray-100">
          <div className="flex min-h-screen">
            <Sidebar
              isOpen={false}
              onCloseAction={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
            <div className="flex-1">
              <Header />

              <div
              style={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "10px",
              }}
            >
              {children}
            </div>
              <main className="p-3">
                <div className="p-1 min-h-[calc(100vh-7rem)]">{children}</div>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </ProtectedLayout> */}
    </>
  );
}
