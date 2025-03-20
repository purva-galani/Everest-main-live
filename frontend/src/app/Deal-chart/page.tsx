import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CardLineChart from "../Deal-chart/chart";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import SearchBar from '@/components/globalSearch';
import Notification from '@/components/notification';
import { Calendar1 } from "lucide-react";

export default function CertificatePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 border-b md:h-20">
          {/* Left Section: Sidebar & Breadcrumbs */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden md:block"/>
            <Breadcrumb>
              <BreadcrumbList className="flex items-center space-x-2 text-sm md:text-base">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/deal/table">Deal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-gray-500">Graph</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Section: Search, Calendar & Notifications */}
          <div className="flex items-center space-x-4">
            <SearchBar className="hidden sm:block" />
            <a href="/calendar" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Calendar1 size={20} />
            </a>
            <Notification />
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Card className="w-full mx-auto max-w-4xl lg:max-w-6xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center md:text-3xl">Deal Manager</CardTitle>
              <CardDescription className="text-center text-sm md:text-base">
                Manage and track your deals effectively.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <CardLineChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
