// const mongose = require('mongoose');

// const userSchema = new mongose.Schema(
//     {
//         empName:{
//             type:String,
//             require:[true,'user name is required'],
//         },
//         email:{
//             type:String,
//             require:[true,'email is required'],
//         },
//         password:{
//             type:String,
//             required:[true,'password is required'],
//         },
//         doj: {
//           type: String,
//           required:[true,'date is required'],
//         },
//         designation:{
//           type:String,
//           required:[true,'Designation is required'],
//         },
//         department:{
//           type:String,
//           required:[true,'department is required'],
//         },
//         band:{
//           type:String,
//           required:[true,'department is required'],
//         },
//         gender:{
//           type:String,
//           require:[true,'gender is required'],
//         },
//         empType:{
//           type:String,
//           require:[true,'user type is required'],
//           default:'Employee',
//           enum:['HR','Manager','Employee'],
//         },

        
//         profile:{
//           type:String,
//           default:'https://img.freepik.com/free-icon/user_318-522233.jpg',
//         }
// },{timestamps:true})

// module.exports = mongose.model('user',userSchema)
const mongose = require('mongoose');

const userSchema = new mongose.Schema(
  {
    employeeId: {
      type: String,
      require: [true, 'employee Id is required'],
      unique:true
    },
    empName: {
      type: String,
      require: [true, 'user name is required'],
    },
    managerName: {
      type: String,
      require: [true, 'Manager Name is required']
    },
    email: {
      type: String,
      require: [true, 'email is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    doj: {
      type: String,
      required: [true, 'date is required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    department: {
      type: String,
      required: [true, 'department is required'],
    },
    band: {
      type: String,
      required: [true, 'department is required'],
    },
    gender: {
      type: String,
      require: [true, 'gender is required'],
    },
    empType: {
      type: String,
      require: [true, 'user type is required'],
      default: 'Employee',
      enum: ['HR', 'Manager', 'Employee'],
    },
  },)

module.exports = mongose.model('user', userSchema)