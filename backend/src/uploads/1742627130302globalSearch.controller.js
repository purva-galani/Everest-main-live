const Deal = require("../model/dealSchema.model");
const Contact = require("../model/contactSchema.model");
const Account = require("../model/accountSchema.model");
const Invoice = require("../model/invoiceSchema.model");
const Lead = require("../model/leadSchema.model");
const Scheduled = require("../model/scheduledSchema.model");
const Task = require("../model/taskSchema.model");
const Complaint = require('../model/complaintSchema.model');

const Search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const regex = new RegExp(query, "i");

    // Search queries for each model
    const accounts = await Account.find({ $or: [ {accountName:regex} ,{ contactName: regex }, { emailAddress: regex }, { contactNumber: regex }, { accountType1: regex } , {industry : regex} , {status: regex} , {accountManager : regex} , {address:regex} , {companyName : regex} , {bankDetails : regex}] }).limit(5);
    const complaint = await Complaint.find({$or: [{ complainerName: regex },{companyName:regex} , { contactNumber: regex }, { emailAddress: regex } ,{subject:regex} , {caseStatus : regex} , {caaseOrigin : regex}] }).limit(5);
    const contacts = await Contact.find({ $or: [{ companyName: regex },{ customerName: regex }, { emailAddress: regex }, { contactNumber: regex }, { address: regex } , {gstNumber : regex}] }).limit(5);
    const deals = await Deal.find({ $or: [{ companyName: regex }, { emailAddress: regex }, { contactNumber: regex }, { address: regex }] }).limit(5);
    const invoices = await Invoice.find({ $or: [{ companyName: regex },{ customerName: regex }, { emailAddress: regex }, { contactNumber: regex }, { address: regex } , {gstNumber : regex} , {customerName: regex} , {productName: regex} , {amount : regex} , {status : regex}] }).limit(5);
    const leads = await Lead.find({ $or: [{ companyName: regex },{ customerName: regex }, { emailAddress: regex }, { contactNumber: regex }, { address: regex } , {productName : regex} , {amount:regex} , {gstNumber:regex},{status: regex}] }).limit(5);
    const schedules = await Scheduled.find({ $or: [{ subject: regex }, { assignedUser: regex }, { customer: regex }, { address: regex }] }).limit(5);
    const tasks = await Task.find({ $or: [{ name: regex },{ subject: regex }, { assigned: regex } , {notes: regex} ] }).limit(5);

    let suggestions = [];
    if (accounts.length > 0) suggestions.push({ page: "Accounts", path: "/Account" });
    if (complaint.length > 0) suggestions.push({ page: "Complaint", path: "/complaint" });
    if (contacts.length > 0) suggestions.push({ page: "Contacts", path: "/contact" });
    if (deals.length > 0) suggestions.push({ page: "Deals", path: "/deal" });
    if (invoices.length > 0) suggestions.push({ page: "Invoices", path: "/invoice" });
    if (leads.length > 0) suggestions.push({ page: "Leads", path: "/lead" });
    if (schedules.length > 0) suggestions.push({ page: "Schedules", path: "/Scheduled" });
    if (tasks.length > 0) suggestions.push({ page: "Tasks", path: "/task" });

    res.json({  deals, contacts, accounts, invoices, leads, schedules, tasks, complaint, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Search };
