// https://www.youtube.com/watch?v=T-Pum2TraX4
//https://jonathans199.medium.com/how-to-deploy-node-express-api-to-ec2-instance-in-aws-bc038a401156
// cd Desktop
// ssh -i "career-connect-key.pem" ubuntu@ec2-43-204-217-202.ap-south-1.compute.amazonaws.com
// cd Career-Connect

// Start an Application:
// pm2 start app.js  # Replace app.js with your entry file

// List Running Applications:
// pm2 list

// Stop an Application:
// pm2 stop <id|name>  # Stop by ID or name

// Restart an Application:
// pm2 restart <id|name>

// Delete an Application:
// pm2 delete <id|name>

// Show Application Details:
// pm2 show <id|name>

// View Logs:
// pm2 logs <id|name>  # View logs for a specific app
// pm2 logs            # View logs for all apps

// Clear Logs:
// pm2 flush  # Clear all logs

// Save the Current Process List:
// pm2 save

// Load Saved Process List:
// pm2 resurrect

// Monitoring and Managing
// Monitor Resource Usage:
// pm2 monit

// Kill PM2 Daemon:
// pm2 kill  # Stop all processes and the PM2 daemon

// Configuration and Environment
// Set Environment Variables:
// pm2 start app.js --env production

// Update PM2:
// pm2 update

// Generate a PM2 Configuration File:
// pm2 ecosystem

// Miscellaneous
// Get PM2 Version:
// pm2 -v

// Check PM2 Documentation:
// pm2 help

// make changes in code and deploy on git
// after that
// ssh -i "career-connect-key.pem" ubuntu@ec2-3-110-84-234.ap-south-1.compute.amazonaws.com
// git pull origin main
// pm2 restart app.js
