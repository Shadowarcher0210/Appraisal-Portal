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
             Thank you for your submission. Your appraisal will be reviewed by your manager, and you will be notified of any updates or further actions required.<br><br>You can view your application status at <a href="http://localhost:3000">http://localhost:3000/employee-dashboard</a>.   <br><br>If you have any questions or need assistance, please do not hesitate to reach out to your HR representative.<br><br>
             Best regards,<br>
             BlueSpire`
    };

    const managerMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mounika.takur@thebluespire.com',
      subject: 'Confirmation of appraisal form submission',
      html: `Dear ${user.managerName},<br><br>
      This is a system-generated email to confirm that ${user.empName} has successfully submitted their appraisal form for the <strong>${presentYear} - ${nextYear}</strong> appraisal cycle.<br><br>
      Submission Details:<br><br>Employee Name: ${user.empName} <br><br>Department: ${user.department}.<br><br>You can view your employee's application status at <a href="http://localhost:3000">http://localhost:3000/manager-performance</a>.<br><br>Thank you./n/nBest regards,<br>BlueSpire`
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


const sendCompletedEmails = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const user = await UserModel.findOne({ employeeId });

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
    const presentYear = new Date().getFullYear();
    const nextYear = presentYear + 1;

    const HRMailOptions = {
      from: process.env.EMAIL_USER,
      to:"naveenkumar44820@gmail.com" ,
       subject : 'Appraisal reviewed by manager',
       html : `Dear HR Team,<br><br>
                    This is a system-generated email to inform you that the appraisal for employee <strong>${user.empName}</strong> has been reviewed by their manager <strong>${user.managerName}</strong> for the <strong>${presentYear} - ${nextYear}</strong> Appraisal cycle on ${currentDate}.<br><br>
                    The performance evaluation has been completed, and the manager has finalized the review.<br><br>
                    You can view and edit the employee's application status at <a href="http://localhost:3000">http://localhost:3000/manager-performance</a>.<br><br>
                    If you have any questions, feel free to reach out.<br><br>Thank you.
                    Best regards,<br>
                    BlueSpire`
    };

 
    await transporter.sendMail(HRMailOptions);

    return res.status(200).json({ message: 'Emails sent successfully' });

  } catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ message: 'Error sending emails' });
  }
};

const sendGoalsAddedEmails = async (req, res) => {
  try {
    const { employeeId } = req.body;
  
    if (!employeeId) {
      return res.status(400).send({
        success: false,
        message: 'Employee ID is required',
      });
    }
  
    const user = await UserModel.findOne({ employeeId });
  
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
    const presentYear = new Date().getFullYear();
    const nextYear = presentYear + 1;
  
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Goals submission notification',
      html: `
        <p>Dear ${user.empName},</p><p>This is a system-generated email to inform you that your manager <strong>${user.managerName}</strong> has assigned you goals on <strong>${currentDate}</strong> for the year <strong>${presentYear} - ${nextYear}</strong>.</p>
        <p>Your manager may contact you for further discussions or clarifications regarding the assigned goals.</p> <p> You can view the submitted goals at <a href="http://localhost:3000/employee-performance">http://localhost:3000/employee-performance </a>.</p> 
        <p> If you have any questions, feel free to reach out to HR.<br><br>Thank you.
        </p><p>Best regards,<br>
        BlueSpire</p> `,
    };
  
   
    await transporter.sendMail(userMailOptions);
  
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending email',
    });
  }
  };
  

  const sendFinalHREmails = async (req, res) => {
    try {
      const { employeeId } = req.body;
  
      if (!employeeId) {
        return res.status(400).send({
          success: false,
          message: 'Employee ID is required',
        });
      }
  
      const user = await UserModel.findOne({ employeeId });
  
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
      const presentYear = new Date().getFullYear();
      const nextYear = presentYear + 1;
  
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Appraisal has been reviewed ',
        html: `
          <p>Dear ${user.empName},</p>
          <p>This is a system-generated email to inform you that your appraisal for the year <strong>${presentYear} - ${nextYear}</strong> has been reviewed. Your manager, <strong>${user.managerName}</strong>, will discuss it with you shortly.</p>
          You can view your application status at <a href="http://localhost:3000">http://localhost:3000/employee-dashboard</a>.<br><br>If you have any questions or need assistance, please do not hesitate to reach out to your HR representative.<br><br>
          <br><br>Thank you.
           Best regards,<br>
           BlueSpire`,
      };
  
      await transporter.sendMail(userMailOptions);
  
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
      });
  
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error sending email',
      });
    }
  };
  

module.exports ={sendConfirmationEmails,sendCompletedEmails, sendGoalsAddedEmails,sendFinalHREmails};