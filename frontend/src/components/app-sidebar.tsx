"use client"

import * as React from "react"
import {
  AudioWaveform,
  BellMinus,
  BookCheck,
  CalendarSync,
  CirclePlay,
  Command,
  File,
  GalleryVerticalEnd,
  HandCoins,
  Handshake,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  Settings,
  SquareUser,
  Target,
  UserX,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@admin.com",
    avatar: "",
  },
  teams: [
    {
      name: "Spriers",
      logo: GalleryVerticalEnd,
      plan: "Information Technology",
    },
    {
      name: "Google",
      logo: AudioWaveform,
      plan: "IT Corporation",
    },
    {
      name: "Microsoft",
      logo: Command,
      plan: "Technology Company",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
      {  title: "Dashboard", url: "/dashboard",}
      ]
    },
    {
      title: "Lead",
      url: "/lead",
      icon: Target,
      items: [
        { title: "Create", url: "/lead" },
        { title: "List", url: "/lead/table" },
        { title: "Graph", url: "/Lead-chart" },
        { title: "Drag & Drop", url: "/lead/leadDrop" }
      ],
    },
    {
      title: "Invoice",
      url: "/invoice",
      icon: ReceiptText,
      items: [
        { title: "Create", url: "/invoice" },
        { title: "List", url: "/invoice/table" },
        { title: "Graph", url: "/Invoice-chart" },
        { title: "Drag & Drop", url: "/invoice/invoiceDrop" }
      ],
    },
    {
      title: "Reminder",
      url: "/reminder",
      icon: BellMinus,
      
      items: [
        { title: "List", url: "/reminder/table" },
        { title: "Email", url: "/reminder/reminderEmail" },
      ],
    },
    {
      title: "Deal",
      url: "/deal",
      icon: Handshake,
      
      items: [
        { title: "Create", url: "/deal" },
        { title: "List", url: "/deal/table" },
        { title: "Graph", url: "/Deal-chart" },
        { title: "Drag & Drop", url: "/deal/dealDrop" }
      ],
    },
    {
      title: "Task",
      url: "/task",
      icon: BookCheck,
      
      items: [
        { title: "Create", url: "/task" },
        { title: "List", url: "/task/table" },
        { title: "Drag & Drop", url: "/task/taskDrop" }
      ],
    },
    {
      title: "Complaint",
      url: "/complaint",
      icon: UserX,
      
      items: [
        { title: "Create", url: "/complaint" },
        { title: "List", url: "/complaint/table" },
        { title: "Email", url: "/complaint/complaintEmail" }
      ],
    },
    {
      title: "Contact",
      url: "/contact",
      icon: SquareUser,
      
      items: [
        { title: "Create", url: "/contact" },
        { title: "List", url: "/contact/table" },
        { title: "Email", url: "/contact/contactEmail" }
      ],
    },
    {
      title: "Account",
      url: "/account",
      icon: HandCoins,
      
      items: [
        { title: "Create", url: "/Account" },
        { title: "List", url: "/Account/table" }
      ],
    },
    {
      title: "Documents",
      url: "/document",
      icon: ScrollText,
      items: [
        { title: "Others", url: "/flipflap" }
      ],
    },
    {
      title: "Schedule",
      url: "/scheduled",
      icon: CalendarSync,
      
      items: [
        { title: "Create", url: "/Scheduled" },
        { title: "List", url: "/Scheduled/table" }
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CirclePlay,
      
      items: [
        { title: "Calendar", url: "/calendar"},
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isClient, setIsClient] = React.useState(false)
  const [activePath, setActivePath] = React.useState("")

  React.useEffect(() => {
    setIsClient(true) 
    setActivePath(window.location.pathname)
  }, [])

  const updatedNavMain = React.useMemo(
    () =>
      data.navMain.map((item) => ({
        ...item,
        isActive: isClient && activePath === item.url, 
        items: item.items?.map((subItem) => ({
          ...subItem,
          isActive: isClient && activePath === subItem.url, 
        })),
      })),
    [isClient, activePath]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={updatedNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}