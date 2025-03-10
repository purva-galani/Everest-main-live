const Contact = require('../model/contactSchema.model');
const nodemailer = require("nodemailer");

// Send SMS Function
const sendSMS = async (req, res) => {
  const { id } = req.params;  // Extract the contact ID from the request parameters
  const { message } = req.body;  // Extract the message from the request body

  // Validate that a message is provided
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required',
    });
  }
  }
// Initialize Nodemailer with hardcoded email ID and app password
const transporter = nodemailer.createTransport({
    service: "gmail",  // Or another service like SendGrid
    auth: {
        user: process.env.EMAIL_USER,  // Get email from .env
        pass: process.env.EMAIL_PASS,  // Get password from .env
    },
});

// Create Contact
const createContact = async (req, res) => {
  const { companyName, customerName, emailAddress, contactNumber, address, gstNumber, description } = req.body;

  try {
    const newContact = new Contact({ companyName, customerName, emailAddress, contactNumber, address, gstNumber, description });
    const contact = await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};

const sendEmailReminder = async (req, res) => {
  const { id } = req.params;  // Extract the contact ID from the request parameters
  const { message } = req.body;  // Extract the message from the request body

  // Validate the message field
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required',
    });
  }

  try {
    // Find the contact by ID
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Define the email options
    const mailOptions = {
      from: "your-email@gmail.com",  // Your email address
      to: contact.emailAddress, // Recipient's email address from the database
      subject: "",  // Subject of the email
      text: message,  // The message the user wrote
    };

    // Send the email using Nodemailer
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
        message: `Email sent successfully to ${contact.email}`,
        data: info.response,  // Return the email info (optional)
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

// Get All Contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
};

// Update Contact
const updateContact = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

// Delete Contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

// Get Contact By ID
const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

const createCallLink = async (req, res) => {
  const fixedPhoneNumber = "+123456789"; // Replace this with your phone number

  try {
    // Generate the call link using the fixed phone number
    const callLink = `tel:${fixedPhoneNumber}`;

    res.status(200).json({
      success: true,
      message: 'Call link generated successfully',
      callLink: callLink, // Return the call link
    });
  } catch (error) {
    console.error('Error generating call link:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};


const sendEmailContact = async (req, res) => {
  const { to, subject = "(No Subject)", message = "(No Message)" } = req.body; // Provide default values
  const attachments = req.files; // Get uploaded files

  if (!to) {
      return res.status(400).json({
          success: false,
          message: "The recipient's email (to) is required.",
      });
  }

  try {
      const mailOptions = {
          from: "purvagalani@gmail.com",
          to: to,
          subject: subject || "(No Subject)", // Use default if empty
          html: message || "(No Message)", // Use default if empty
          attachments: attachments
              ? attachments.map(file => ({
                    filename: file.originalname,
                    path: file.path,
                }))
              : [], // Handle case where there are no attachments
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
              message: `Email sent successfully to ${to}`,
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

module.exports = {
  sendSMS,
  createContact,
  updateContact,
  deleteContact,
  getAllContacts,
  getContactById,
  sendEmailReminder,
  createCallLink, 
  sendEmailContact
};


