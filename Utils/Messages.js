const welcomeMessageUser = (name) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #4CAF50;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Welcome to Career Connect!</h1>
        </div>
        <div class="image-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/all-backend-fd5c7.appspot.com/o/Icons%2FCareer_Connect-removebg-preview.png?alt=media&token=6db679d0-9402-4bb3-81ae-85a3ab8d1538" alt="Career Connect Logo">
        </div>
        <div class="content">
            <p class="bold">Dear ${name.toUpperCase()},</p>
            <p class="bold">We are thrilled to have you on board with Career Connect, your ultimate job portal where you can find a vast number of job opportunities tailored to your career goals.</p>
            <p class="bold">Our platform is designed to make your job search seamless and efficient. Whether you're looking for your first job or aiming to advance your career, Career Connect has the resources and network to help you succeed.</p>
            <p class="bold">We are here to support you every step of the way. If you have any questions or need assistance, please feel free to reach out to our support team.</p>
            <p class="bold">Best Regards,<br>The Career Connect Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Career Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const welcomeMessageRecruiter = (name) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #4CAF50;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Welcome to Career Connect!</h1>
        </div>
        <div class="image-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/all-backend-fd5c7.appspot.com/o/Icons%2FCareer_Connect-removebg-preview.png?alt=media&token=6db679d0-9402-4bb3-81ae-85a3ab8d1538" alt="Career Connect Logo">
        </div>
        <div class="content">
            <p class="bold">Dear ${name.toUpperCase()},</p>
            <p class="bold">We are excited to welcome you to Career Connect, the premier job portal where you can find a vast pool of talented candidates for your organization.</p>
            <p class="bold">Our platform is designed to make your recruitment process seamless and efficient. Whether you are looking to fill entry-level positions or seeking experienced professionals, Career Connect has the resources and network to help you find the perfect match.</p>
            <p class="bold">We are here to support you every step of the way. If you have any questions or need assistance, please feel free to reach out to our support team.</p>
            <p class="bold">Best Regards,<br>The Career Connect Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Career Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const sendOtpEmail = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #4CAF50;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .bold {
            font-weight: bold;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            border: 2px dashed #4CAF50;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Verify Your Identity</h1>
        </div>
        <div class="content">
            <p class="bold">Dear ${name.toUpperCase()},</p>
            <p class="bold">To proceed with your request, please verify your identity by entering the following One-Time Password (OTP):</p>
            <div class="otp">${otp}</div>
            <p class="bold">Please enter this OTP on the verification page to continue. This OTP is valid for the next 5 minutes. If you did not request this, please ignore this email or contact our support team.</p>
            <p class="bold">Best Regards,<br>The Career Connect Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Career Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const resendOTP = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #4CAF50;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .bold {
            font-weight: bold;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            border: 2px dashed #4CAF50;
            display: inline-block;
        }
        .resend-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #ff5722;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Verify Your Identity</h1>
        </div>
        <div class="content">
            <p class="bold">Dear ${name.toUpperCase()},</p>
            <p class="bold">To proceed with your request, please verify your identity by entering the following One-Time Password (OTP):</p>
            <div class="otp">${otp}</div>
            <p class="bold">This OTP is valid for the next 5 minutes. Please enter it on the verification page to continue. If the OTP expires, you can request a new one using the link below.</p>
            <p class="bold">If you did not request this, please ignore this email or contact our support team.</p>
            <p class="bold">Best Regards,<br>The Career Connect Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Career Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
const sendForgotPasswordEmail = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #FF9800;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #FF9800;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #FF9800;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .bold {
            font-weight: bold;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            border: 2px dashed #FF9800;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Reset Your Password</h1>
        </div>
        <div class="content">
            <p class="bold">Dear ${name.toUpperCase()},</p>
            <p class="bold">We received a request to reset the password for your account. Please use the following One-Time Password (OTP) to proceed:</p>
            <div class="otp">${otp}</div>
            <p class="bold">This OTP is valid for the next 5 minutes. Enter it on the password reset page to continue. If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
            <p class="bold">Best Regards,<br>The Support Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const companyStatusMessage = (userName, companyName, status) => {
  const statusMessage =
    status === 'interested'
      ? 'has shown interest in your application. They may reach out soon to discuss further opportunities.'
      : 'has seen your application. They may take some time to review it and get back to you.';

  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #4CAF50;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
        .bold {
            font-weight: bold;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="bold">Application Status Update</h1>
        </div>
        <div class="content">
            <p class="bold">Dear ${userName.toUpperCase()},</p>
            <p>We are pleased to inform you that <span class="bold">${companyName}</span> has shown some interest in your application</p>
            <p>We encourage you to check your inbox or chat section for any further updates and remain patient as the hiring process continues.</p>
            <p class="bold">Best of luck with your job search!</p>
            <p class="bold">Regards,<br>The Career Connect Team</p>
        </div>
        <div class="footer">
            <p class="bold">&copy; 2024 Career Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
const getEmailSubject = (companyName, status) => {
  return status === 'Interested'
    ? `Great News! ${companyName} is Interested in Your Application`
    : `${companyName} Has Viewed Your Application`;
};
module.exports = {
  welcomeMessageUser,
  welcomeMessageRecruiter,
  sendOtpEmail,
  resendOTP,
  sendForgotPasswordEmail,
  companyStatusMessage,
  getEmailSubject,
};
