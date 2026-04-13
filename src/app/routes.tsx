import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { BusinessPulse } from "./pages/BusinessPulse";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: BusinessPulse },
      { path: "*", Component: () => <div className="p-8 text-slate-500">Module under construction</div> }
    ],
  },
]);