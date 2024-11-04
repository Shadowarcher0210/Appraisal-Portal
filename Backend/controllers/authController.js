// const UserModel = require("../models/User");
// const bcrypt = require("bcryptjs");
// const JWT = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// const registerUser = async (req, res) => {
//     try {
//         const { empName, email, password, doj, designation, department,band, gender, empType} = req.body;

//         // Validation
//         if (!empName || !email || !password || !doj || !designation || !department || !band || !gender || !empType ) {
//             return res.status(500).send({
//                 success: false,
//                 message: 'Please provide all fields',
//             });
//         }
//         // Check if the user already exists
//         const existing = await UserModel.findOne({ email });
//         if (existing) {
//             return res.status(500).send({
//                 success: false,
//                 message: 'Email already registered, please login',
//             });
//         }

//         var salt = bcrypt.genSaltSync(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
       
//        const formattedDoj = new Date(doj).toISOString().split('T')[0];

//         const user = await UserModel.create({
//             empName,
//             email,
//             password: hashedPassword,
//             doj: formattedDoj,
//             designation,
//             department,
//             band,
//             gender,
//             empType,
           
//         });

//         res.status(201).send({
//             success: true,
//             message: 'Successfully registered',
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//         //message: 'Error in Register API',
//             error,
//         });
//     }
// };

// const loginUser = async(req,res)=>{
//     try {

//         const{email,password}=req.body
//         //validation
//         if(!email || !password){
//             return req.status(500).send({
//                 success:false,
//                 message:'Please provide Email or Password'
//             })
//         }

//         //check user
//         const user = await UserModel.findOne({email})
//         console.log(user)
//         if(!user){
//            return res.status(404).send({
//             success:false,
//             message:'User Not found ',
//            }) 
//         }

//         //Check uset password | comparae password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch){
//             return res.status(404).send({
//                 success:false,
//                 message:'Invalid Credentials'
//             })
//         }

//         //token
//         const token = JWT.sign({id:user._id}, process.env.JWT_SECRET,{
//            expiresIn : "2d",
//         })
//         user.password = undefined;
//         res.status(200).send({
//             success:true,
//             message:'Login Successfully',
//             token,
//             user,
//         })

// console.log("user",user)
// console.log("employeeId", user._id)
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:'Error In Login API',
//             error
//         })
        
//     }
// }
// const forgotPassword = async (req, res) => {
//     try {
//       const { email } = req.body;
  
//       // Find the user by email
//       const user = await UserModel.findOne({ email });
//       if (!user) {
//         return res.status(404).send({
//           success: false,
//           message: 'User not found',
//         });
//       }
  
//       // Generate token
//       const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//       });
  
//       // Set up nodemailer transport
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });
  
//       // Define mail options
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Reset Your Password',
//         text: `Hello ${user.empName},\n\nWe received a request to reset your password. If you initiated this request, please click the link below to reset your password:http://localhost:3000/resetPassword/${user._id}/${token}\n\nIf you did not request a password reset, please ignore this email, and no changes will be made to your account.\n\nThanks & Regards,\nBlueSpire `,
//       };
  
//       // Send email
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Email Error:', error);
//           return res.status(500).send({
//             success: false,
//             message: 'Error sending reset password email',
//             error
//           });
//         } else {
//           return res.status(200).send({
//             success: true,
//             message: 'Password reset email sent successfully',
//             token: token
//           });
//         }
//       });
  
//     } catch (error) {
//       console.error('Forgot Password Error:', error);
//       return res.status(500).send({
//         success: false,
//         message: 'Error in Forgot Password API',
//         error
//       });
//     }
//   };
//   const resetPassword = async (req, res) => {
//     try {
//       const { id, token } = req.params;
//       const { password } = req.body;
  
  
//       const decoded = JWT.verify(token, process.env.JWT_SECRET);
  
//       if (!decoded || decoded.id !== id) {
//         return res.status(401).send({
//           success: false,
//           message: "Invalid or expired token",
//         });
//       }
  
      
//       const hashedPassword = await bcrypt.hash(password, 10);
  
     
//       const updatedUser = await UserModel.findByIdAndUpdate(
//         id,
//         { password: hashedPassword },
//         { new: true } 
//       );
  
//       if (!updatedUser) {
//         return res.status(404).send({
//           success: false,
//           message: "User not found",
//         });
//       }
  
//       return res.status(200).send({
//         success: true,
//         message: "Password changed successfully",
//       });
//     } catch (error) {
//       console.error("Reset Password Error:", error);
  
  
//       if (error.name === "JsonWebTokenError") {
//         return res.status(400).send({
//           success: false,
//           message: "Malformed or invalid token",
//         });
//       } else if (error.name === "TokenExpiredError") {
//         return res.status(401).send({
//           success: false,
//           message: "Token has expired",
//         });
//       }
  
     
//       return res.status(500).send({
//         success: false,
//         message: "Error resetting the password",
//         error,
//       });
//     }
//   };
  
  
// module.exports = {registerUser,loginUser,forgotPassword,resetPassword};

const Employee = require("../models/User");
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  try {
    const { employeeId, empName, email, password, doj, managerName, designation, department, band, gender, empType } = req.body;


    if (!employeeId || !empName || !email || !password || !doj || !managerName || !designation || !department || !band || !gender || !empType) {
      return res.status(500).send({
        success: false,
        message: 'Please provide all fields',
      });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(500).send({
        success: false,
        message: 'Email already registered, please login',
      });
    }

    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const formattedDoj = new Date(doj).toISOString().split('T')[0];

    const user = await UserModel.create({
      employeeId,
      empName,
      email,
      password: hashedPassword,
      doj: formattedDoj,
      managerName,
      designation,
      department,
      band,
      gender,
      empType,

    });

    res.status(201).send({
      success: true,
      message: 'Successfully registered',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,

      error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body; // Extract email and password from the request body

      // Validate that email and password are provided
      if (!email || !password) {
          return res.status(400).json({
              success: false,
              message: 'Email and password are required',
          });
      }

      // Fetch the user based on email
      const user = await Employee.findOne({ email });

      // Check if user exists
      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'Employee not found',
          });
      }

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({
              success: false,
              message: 'Invalid password',
          });
      }

      const token = JWT.sign({id:user._id}, process.env.JWT_SECRET,{
        expiresIn : "2d",
     })
     user.password = undefined;
     res.status(200).send({
         success:true,
         message:'Login Successfully',
         token,
         user,
     })

      console.log("user",user)
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
          success: false,
          message: 'Server error during login',
      });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    // Generate token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      text: `Hello ${user.empName},\n\nWe received a request to reset your password. If you initiated this request, please click the link below to reset your password:http://localhost:3000/resetPassword/${user._id}/${token}\n\nIf you did not request a password reset, please ignore this email, and no changes will be made to your account.\n\nThanks & Regards,\nBlueSpire `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email Error:', error);
        return res.status(500).send({
          success: false,
          message: 'Error sending reset password email',
          error
        });
      } else {
        return res.status(200).send({
          success: true,
          message: 'Password reset email sent successfully',
          token: token
        });
      }
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in Forgot Password API',
      error
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;


    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.id !== id) {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired token",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);


    if (error.name === "JsonWebTokenError") {
      return res.status(400).send({
        success: false,
        message: "Malformed or invalid token",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Token has expired",
      });
    }


    return res.status(500).send({
      success: false,
      message: "Error resetting the password",
      error,
    });
  }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword };