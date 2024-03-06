import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sideBar";
import Navbar from "./navBar";

export default function Admin(props: any) {
  const { ...rest } = props;
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);


  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2 mt-5 dark:text-white">
              <Suspense fallback={<p>Loading</p>}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
