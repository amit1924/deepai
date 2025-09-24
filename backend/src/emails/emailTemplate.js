export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Messenger</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Exo+2:wght@300;400;500&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Exo 2', sans-serif;
            line-height: 1.6;
            background-color: #0a0a12;
            color: #e0e0ff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .container {
            background: linear-gradient(145deg, #0c0c1a, #121228);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 0 25px rgba(91, 134, 229, 0.3),
                        0 0 50px rgba(54, 209, 220, 0.2);
        }
        
        .header {
            background: linear-gradient(to right, #121228, #1a1a3a);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #36D1DC;
            box-shadow: 0 0 15px rgba(54, 209, 220, 0.5),
                        0 0 30px rgba(91, 134, 229, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(45deg, #36D1DC, #5B86E5, #36D1DC);
            z-index: -1;
            filter: blur(20px);
            opacity: 0.4;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            border-radius: 50%;
            background-color: #121228;
            padding: 10px;
            border: 2px solid #36D1DC;
            box-shadow: 0 0 15px rgba(54, 209, 220, 0.7);
        }
        
        h1 {
            color: #fff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 10px rgba(91, 134, 229, 0.8),
                         0 0 20px rgba(91, 134, 229, 0.5);
        }
        
        .content {
            background-color: rgba(18, 18, 40, 0.8);
            padding: 35px;
            position: relative;
            overflow: hidden;
        }
        
        .content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, #36D1DC, #5B86E5, #36D1DC, transparent);
            box-shadow: 0 0 10px rgba(54, 209, 220, 0.7);
        }
        
        .highlight {
            color: #5B86E5;
            font-weight: 500;
            text-shadow: 0 0 5px rgba(91, 134, 229, 0.7);
        }
        
        .info-box {
            background-color: rgba(15, 15, 30, 0.7);
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            border-left: 4px solid #36D1DC;
            box-shadow: 0 0 15px rgba(54, 209, 220, 0.3);
        }
        
        .info-box strong {
            color: #36D1DC;
            font-size: 16px;
            margin: 0 0 15px 0;
            display: block;
            text-shadow: 0 0 5px rgba(54, 209, 220, 0.5);
        }
        
        ul {
            padding-left: 20px;
            margin: 0;
        }
        
        li {
            margin-bottom: 10px;
            color: #e0e0ff;
            position: relative;
        }
        
        li::before {
            content: '➤';
            color: #5B86E5;
            position: absolute;
            left: -20px;
            text-shadow: 0 0 5px rgba(91, 134, 229, 0.7);
        }
        
        .cta-button {
            text-align: center;
            margin: 30px 0;
        }
        
        .button {
            background: linear-gradient(to right, #36D1DC, #5B86E5);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 500;
            display: inline-block;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 1px;
            border: none;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(91, 134, 229, 0.5),
                        0 0 30px rgba(54, 209, 220, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .button::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #36D1DC, #5B86E5, #36D1DC);
            z-index: -1;
            filter: blur(10px);
            opacity: 0.7;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(91, 134, 229, 0.7),
                        0 0 40px rgba(54, 209, 220, 0.4);
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #5B86E5;
            font-size: 12px;
            border-top: 1px solid rgba(91, 134, 229, 0.3);
            background: rgba(12, 12, 26, 0.7);
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #36D1DC;
            text-decoration: none;
            margin: 0 10px;
            text-shadow: 0 0 5px rgba(54, 209, 220, 0.5);
            transition: all 0.3s ease;
        }
        
        .footer a:hover {
            color: #5B86E5;
            text-shadow: 0 0 8px rgba(91, 134, 229, 0.8);
        }
        
        .glow-text {
            text-shadow: 0 0 5px currentColor;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="Messenger Logo">
            <h1>Welcome to Messenger!</h1>
        </div>
        
        <div class="content">
            <p class="highlight"><strong>Hello ${name},</strong></p>
            <p>We're excited to have you join our messaging platform! Messenger connects you with friends, family, and colleagues in real-time, no matter where they are.</p>
            
            <div class="info-box">
                <strong>Get started in just a few steps:</strong>
                <ul>
                    <li>Set up your profile picture</li>
                    <li>Find and add your contacts</li>
                    <li>Start a conversation</li>
                    <li>Share photos, videos, and more</li>
                </ul>
            </div>
            
            <div class="cta-button">
                <a href="${clientURL}" class="button">Open Messenger</a>
            </div>
            
            <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
            <p style="margin-top: 0;">Happy messaging!</p>
            
            <p style="margin-top: 25px; margin-bottom: 0;" class="glow-text">Best regards,<br>The Messenger Team</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Messenger. All rights reserved.</p>
            <p>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
