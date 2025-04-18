"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MdCancel } from "react-icons/md";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Meteors } from "@/components/ui/meteors";
import { useRouter } from "next/navigation"; 
import { ModeToggle } from "@/components/ModeToggle"
import SearchBar from '@/components/globalSearch';
import Notification from '@/components/notification';
import { Calendar1 } from "lucide-react";
interface Lead {
  _id: string;
  companyName: string;
  customerName: string;
  amount: number;
  productName: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  notes: string;
  date: string;
  endDate: string;
  status: "New" | "Discussion" | "Demo" | "Proposal" | "Decided";
  isActive: boolean;
}

const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/lead/getAllLeads");
    const data = await response.json();
    if (data.success) return data.data;
    throw new Error(data.message);
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw new Error("Failed to fetch leads");
  }
};

export default function App() {
  const [groupedLeads, setGroupedLeads] = useState<Record<string, Lead[]>>({});
  const [error, setError] = useState("");
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter(); 

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const fetchedLeads = await getAllLeads();
        groupLeadsByStatus(fetchedLeads);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); 
        } else {
          setError("An unknown error occurred");
      }
    };
  }
    fetchLeads();
  }, []);

  const groupLeadsByStatus = (leads: Lead[]) => {
    const grouped = leads.reduce((acc, lead) => {
      if (!acc[lead.status]) acc[lead.status] = [];
      acc[lead.status].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
    setGroupedLeads(grouped);
  };

  const statusColors: Record<string, string> = {
    Proposal: "bg-purple-200 text-gray-800 border-2 border-purple-900 shadow-lg shadow-purple-900/50",
    New: "bg-purple-200 text-gray-800 border-2 border-purple-900 shadow-lg shadow-purple-900/50",
    Discussion: "bg-purple-200 text-gray-800 border-2 border-purple-900 shadow-lg shadow-purple-900/50",
    Demo: "bg-purple-200 text-gray-800 border-2 border-purple-900 shadow-lg shadow-purple-900/50",
    Decided: "bg-purple-200 text-gray-800 border-2 border-purple-900 shadow-lg shadow-purple-900/50",
  };

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateString}`); 
    return "Invalid Date"; 
  }
  return date.toISOString().split("T")[0]; 
};

  const handleDragStart = (e: React.DragEvent, lead: Lead, fromStatus: string) => {
    e.dataTransfer.setData("lead", JSON.stringify(lead));
    e.dataTransfer.setData("fromStatus", fromStatus);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e: React.DragEvent, toStatus: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const leadData = e.dataTransfer.getData("lead");
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (!leadData || !fromStatus || fromStatus === toStatus) return;

    const lead: Lead = JSON.parse(leadData);
    const updatedLead = { ...lead, status: toStatus };

    setGroupedLeads((prev) => ({
      ...prev,
      [fromStatus]: prev[fromStatus]?.filter((l) => l._id !== lead._id) || [],
      [toStatus]: [...(prev[toStatus] || []), updatedLead as Lead],
    }));
    

    try {
      const response = await fetch("http://localhost:8000/api/v1/lead/updateLeadStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead._id, status: toStatus }),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to update lead status on server.");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                <BreadcrumbList className="flex items-center space-x-2">
                    <BreadcrumbItem className="hidden sm:block md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:block md:block"/>
                    <BreadcrumbItem className="hidden sm:block md:block">
                    <BreadcrumbLink href="/lead/table">Lead</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:block md:block" />
                    <span className="hidden sm:block md:block">
                       Drag & Drop 
                    </span>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center space-x-4 ml-auto mr-4">
                <div  >
                    <SearchBar />
                </div>
                <a href="/calendar">
                    <div>
                        <Calendar1 />
                    </div>
                </a>
                <div>
                    <Notification />
                </div>
            </div>
        </header>
        <div className="p-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Object.keys(statusColors).map((status) => {
              const leadsInStatus = groupedLeads[status] || [];
              const totalAmount = leadsInStatus.reduce((sum, lead) => sum + lead.amount, 0);

              return (
                <div
                  key={status}
                  className={`p-4 rounded-lg  min-h-[530px] transition-all ${draggedOver === status}`}
                  onDrop={(e) => handleDrop(e, status)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggedOver(status);
                  }}
                  onDragLeave={() => setDraggedOver(null)}
                >
                  <h2 className={`text-sm font-bold mb-4 px-5 py-2 rounded-lg ${statusColors[status]}`}>{status}</h2>
                  <div className="p-3 bg-[#FAF3DD]   rounded-md shadow">
                    <p className="text-sm font-semibold text-gray-500">Total Leads: {leadsInStatus.length}</p>
                    <p className="text-sm font-semibold text-gray-500">Total Amount: ₹{totalAmount}</p>
                  </div>
                  <div
                    className="scrollable"
                  >
                    {leadsInStatus.length === 0 ? (
                      <p className="text-gray-500 text-center">No leads available</p>
                    ) : (
                      leadsInStatus.map((lead) => (
                        <div
                          key={lead._id}
                          className="card-container  mt-4"
                        >
                          <div
                            className="card border border-gray-300 rounded-lg shadow-md bg-white p-3 cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead, status)}
                            onClick={() => handleLeadClick(lead)}
                          >

                            <p>Company Name: <span>{lead.companyName}</span></p>
                            <p>Product: <span>{lead.productName}</span></p>
                            <p>Amount: <span>₹{lead.amount}</span></p>
                            <p>Next Date: <span>{formatDate(lead.endDate)}</span></p>

                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isModalOpen && selectedLead && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-lg relative">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />

                <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-6 py-8 rounded-2xl">
                  <div
                    className="absolute top-3 right-3 h-8 w-8 rounded-full border border-gray-500 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setIsModalOpen(false); 
                    }}
                  >
                    <MdCancel className="text-white text-2xl"/>
                      
                  </div>

                 
                  <h1 className="font-bold text-2xl text-white mb-6 text-center">Lead Details</h1>

                  <div className="grid grid-cols-2 gap-4 text-white">
                    {Object.entries(selectedLead)
                      .filter(([key]) => !["_id", "isActive", "createdAt", "updatedAt"].includes(key))
                      .map(([key, value]) => (
                        <p key={key} className="text-sm">
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                          {["date", "endDate"].includes(key) && value
                            ? new Date(value).toLocaleDateString()
                            : value || "N/A"}
                        </p>
                      ))}
                  </div>

                  <Meteors number={20} />
                </div>
              </div>
            </div>
          )}
        </div>
        </SidebarInset>
        </SidebarProvider>
  );
}
