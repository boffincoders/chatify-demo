
import {
  MdChatBubble,
  MdDashboard,
  MdGroup
} from "react-icons/md";
export interface IAllAreaRoutes {
  name: string;
  key: string;
  path: string;
  icon: any;
  children?: IAllAreaRoutes[]
}
const routes: IAllAreaRoutes[] = [
  {
    name: "Dashboard",
    key: "/dashboard",
    path: "./pages/dashboard/home",
    icon: <MdDashboard className="h-6 w-6" />,
  },
  {
    name: "Chats",
    key: "/chats",
    icon: <MdChatBubble className="h-6 w-6" />,
    path: "./pages/dashboard/chats",
  },

  {
    name: "Groups",
    key: "/groups",
    icon: <MdGroup className="h-6 w-6" />,
    path: "./pages/dashboard/groups",
  },
];
export default routes;
