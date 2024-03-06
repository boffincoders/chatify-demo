import { Menu, MenuProps } from "antd";
import { useState } from "react";
import { RiDashboard2Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}




export function SidebarLinks(props: any) {
  let location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string[]>([''])
  const navigate = useNavigate()
  const { routes } = props;

  const activeRoute = (routeName: any) => {
    return location.pathname.includes(routeName);
  };
  const items: any[] = routes.map((x: any) => {
    if (x.children && x.children.length > 0) return getItem(x.name, x.key, <div className={activeRoute(x.key) ? "dark:!text-white" : ""} style={activeRoute(x.key) ? { color: "blue" } : {}} >{x.icon}</div>, x.children.map((child: any) => getItem(<li className="hover:text-[#A3AED0]">{child.name}</li>, child.key)
    ))
  })
  const createLinks = (routes: any) => {
    return routes.map((route: any, index: any) => {
      if (!route.children || route.children.length <= 0)
        return (
          <Link onClick={() => {
            setSelectedKey([route.key])

          }} key={index} to={route.key}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li
                className="my-[3px] flex cursor-pointer items-center px-8"
                key={index}
              >
                <span
                  className={`${activeRoute(route.key) === true
                    ? "font-bold text-[#00A038] dark:text-white"
                    : "font-medium text-gray-600"
                    }`}
                >
                  {route.icon ? route.icon : <RiDashboard2Line />}
                </span>
                <p
                  className={`leading-1 ml-4 flex ${activeRoute(route.key) === true
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                    }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(route.key) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-[#00A038] dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      else {
        return <div className="relative mb-3 flex hover:cursor-pointer">
          <span
            className={`${activeRoute(route.key) === true
              ? "font-bold text-[#00A038] dark:text-white"
              : "font-medium text-gray-600"
              }  `}
          >
            <p
              className={`leading-1 ml-1 flex ${activeRoute(route.key) === true
                ? "font-bold  dark:text-white"
                : "font-medium text-gray-600"
                } `}
            >
              <Menu className={` ${activeRoute(route.key)
                ? "font-bold  dark:text-white"
                : "font-medium text-gray-600"
                } w-full `}
                selectedKeys={[route.key === location.pathname ? route.key : route.children.find((x: any) => `/${x?.key}` === location.pathname)?.key]}
                openKeys={selectedKey}
                theme={"dark:dark !dark:light" as any}
                onOpenChange={(e) => setSelectedKey(e)}
                onClick={(e) => navigate(e.key)}
                style={{ width: 256, }}

                mode="inline"
                items={items}
              /></p>
          </span>
          {activeRoute(route.key) ? (
            <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-[#00A038] dark:bg-brand-400" />
          ) : null}
        </div>
      }

    });
  };
  return createLinks(routes);
}

export default SidebarLinks;
