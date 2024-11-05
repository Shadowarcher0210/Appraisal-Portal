const nodemailer = require('nodemailer');
const UserModel = require('../models/Email');
const Appraisal = require('../models/Appraisal');
const sendConfirmationEmails = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    const appraisal = await Appraisal.findOne()
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const currentDate = new Date().toLocaleDateString();
    const presentYear = new Date().getFullYear()
    const nextYear = new Date().getFullYear() + 1;
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation of Your Appraisal Form Submission',
      html: `Dear ${user.empName},<br><br>
             This is a system-generated email to confirm that you have successfully submitted your appraisal form on ${currentDate} for the <strong>${presentYear} - ${nextYear}</strong> Appraisal cycle.<br><br>
             Thank you for your submission. Your appraisal will be reviewed by your manager, and you will be notified of any updates or further actions required. If you have any questions or need assistance, please do not hesitate to reach out to your HR representative.<br><br>
             Best regards,<br>
             BlueSpire`
    };

    const managerMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'naveen.pandranki@thebluespire.com',
      subject: 'Confirmation of Appraisal Form Submission',
      text: `Dear ${appraisal.managerName},\n\nThis is a system-generated email to confirm that ${user.empName} has successfully submitted their This is a system-generated email to confirm that your appraisal form for thefor the ${appraisal.initiatedOn} appraisal cycle.\n\nSubmission Details:\nEmployee Name: ${user.empName} \nEmployee ID: ${user._id}\nDepartment: ${user.department}.\n\nPlease review the submitted form at your convenience. If you have any questions or require further information, please contact your HR representative.\n\nThank you.\n\nBest regards,\nBlueSpire`
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(managerMailOptions);

    return res.status(200).json({ message: 'Emails sent successfully' });


  }
  catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ message: 'Error sending emails' });
  }

};

module.exports = { sendConfirmationEmails };