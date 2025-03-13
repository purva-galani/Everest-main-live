const Account = require("../model/accountSchema.model");
const nodemailer = require("nodemailer");

const accountAdd = async (req, res) => {
    try {
        const { accountHolderName, accountNumber, bankName, accountType, IFSCCode, UpiId } = req.body;

        const newAccount = new Account({
            accountHolderName,
            accountNumber,
            bankName,
            accountType,
            IFSCCode,
            UpiId
        });

        const savedAccount = await newAccount.save();
        res.status(201).json({ message: "Account added successfully", data: savedAccount });

    } catch (error) {
        console.error("Error adding account:", error);
        res.status(500).json({ message: "Failed to add account", error: error.message });
    }
};

const updateAccount = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        console.log("Updating account with ID:", id, "and data:", updates);

        const updatedAccount = await Account.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: updatedAccount
        });
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAccount = await Account.findByIdAndDelete(id);

        if (!deletedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
            data: deletedAccount
        });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({});
        res.status(200).json({
            success: true,
            data: accounts
        });
    } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const getAccountById = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await Account.findById(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const getUnpaidAccounts = async (req, res) => {

    try {
        const unpaidAccounts = await Account.find({ status: "Unpaid" });
        res.status(200).json({
            success: true,
            data: unpaidAccounts,
        });
    } catch (error) {
        console.error("Error fetching unpaid accounts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const getPaidAccounts = async (req, res) => {

    try {
        const paidAccounts = await Account.find({ status: 'Paid' });
        res.status(200).json({
            success: true,
            data: paidAccounts
        });
    } catch (error) {
        console.error("Error fetching unpaid accounts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",  
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
    },
});

const sendEmailReminder = async (req, res) => {
    const { id } = req.params; 
    const { message } = req.body; 

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message content is required",
        });
    }

    try {
        const account = await Account.findById(id);

        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        if (!account.emailAddress) {
            return res.status(400).json({
                success: false,
                message: "Email address not available for this account",
            });
        }

        const mailOptions = {
            from: "your-email@gmail.com", 
            to: account.emailAddress, 
            subject: `Payment Reminder for Account #${account.id}`, 
            text: message, 
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error.message);
                return res.status(500).json({
                    success: false,
                    message: "Error sending email: " + error.message,
                });
            }

            console.log("Email sent successfully: " + info.response);
            res.status(200).json({
                success: true,
                message: `Email sent successfully to ${account.emailAddress}`,
                data: info.response, 
            });
        });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};


const sendWhatsAppReminder = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        const countryCode = '+91';
        const customerNumber = account.contactNumber;
        if (!customerNumber) {
            return res.status(400).json({ success: false, message: "Customer contact number not found" });
        }
        const formattedNumber = `${countryCode}${customerNumber}`;

        const message = `Hello ${account.customerName},\n\nThis is a reminder to pay your outstanding account of ₹${account.remainingAmount}. Please make the payment at your earliest convenience.`;

        console.log(`Sending WhatsApp message to: ${formattedNumber}`);
        console.log(`Message: ${message}`);

        res.status(200).json({
            success: true,
            message: "WhatsApp reminder sent successfully",
        });
    } catch (error) {
        console.error("Error sending WhatsApp reminder:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const updateCustomMessage = async(req,res)=>{
    try {
        const { customMessage } = req.body;
        const accountId = req.params.accountId;
    
        const updatedAccount = await Account.findByIdAndUpdate(accountId, { customMessage }, { new: true });
    
        if (!updatedAccount) {
          return res.status(404).json({ message: 'Account not found' });
        }
    
        return res.json({ data: updatedAccount });
      } catch (error) {
        console.error('Error saving custom message:', error);
        res.status(500).json({ message: 'Failed to save custom message' });
      }
}

module.exports = {
    accountAdd,
    updateAccount,
    deleteAccount,
    getAllAccounts,
    getAccountById,
    getUnpaidAccounts,
    getPaidAccounts,
    sendEmailReminder,
    sendWhatsAppReminder,
    updateCustomMessage,
};