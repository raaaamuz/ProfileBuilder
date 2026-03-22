import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Container, Button } from "react-bootstrap";

// Store your HTML template as a string
const resumeHTML = `
    <!DOCTYPE html>
<html lang="en">
<head>  
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Resume</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 50px auto;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: flex;
            overflow: hidden;
            border-radius: 8px;
        }

        .sidebar {
            width: 35%;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .sidebar h2, .sidebar p {
            width: 100%;
            text-align: center;
        }

        .sidebar h2 {
            margin-top: 0;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
            font-size: 20px;
            font-weight: bold;
        }

        .sidebar p {
            margin: 15px 0;
            font-size: 14px;
        }

        .content {
            width: 65%;
            padding: 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 28px;
            margin: 0;
            color: #2c3e50;
        }

        .header p {
            font-size: 18px;
            color: #555;
            margin: 5px 0 0;
        }

        .content h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
            color: #2c3e50;
        }

        .content h3 {
            margin-bottom: 10px;
            font-size: 18px;
            color: #2c3e50;
        }

        .content p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
        }

        .content ul {
            margin: 0 0 30px 20px;
            padding: 0;
            font-size: 16px;
        }

        .content li {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <h2>Contact Information</h2>
            <p>Email: [Your Email]</p>
            <p>Phone: [Your Phone Number]</p>
            <p>LinkedIn: [LinkedIn Profile]</p>
            <p>Portfolio: [Portfolio/Website]</p>

            <h2>Technical Skills</h2>
            <p><strong>Frontend:</strong> React.js, Angular, TypeScript, JavaScript, HTML5, CSS3, SCSS, TailwindCSS, Bootstrap</p>
            <p><strong>Backend:</strong> Node.js, Express.js, RESTful APIs, Microservices</p>
            <p><strong>Databases:</strong> MongoDB, SQL</p>
            <p><strong>AI &amp; ML Integration:</strong> NLP, Machine Learning APIs</p>
            <p><strong>DevOps &amp; Cloud:</strong> AWS, Azure, GCP, CI/CD, Docker</p>
            <p><strong>Testing &amp; Security:</strong> Jest, Mocha, Cypress, OWASP Security Practices</p>
            <p><strong>Other Tools:</strong> Git, Jira, Agile/Scrum, xAPI, SCORM</p>
        </div>

        <div class="content">
            <div class="header">
                <h1>[Your Name]</h1>
                <p>Full Stack Developer</p>
            </div>

            <h2>Professional Summary</h2>
            <p>Innovative and detail-oriented Full Stack Developer with 5+ years of experience specializing in MEAN and MERN stacks. Proven ability to develop scalable, secure, and high-performance web applications. Passionate about AI-driven learning technologies, with hands-on experience integrating NLP and machine learning into web platforms. Adept at working in international, cross-functional teams and delivering high-quality solutions within Agile environments.</p>

            <h2>Professional Experience</h2>
            <h3>Full Stack Developer</h3>
            <p>[Your Current/Most Recent Company] | [Start Date] - Present</p>
            <ul>
                <li>Designed and developed scalable web applications using MEAN and MERN stacks, improving system performance by 30%.</li>
                <li>Integrated AI-driven NLP models into a learning platform, enhancing personalized learning experiences.</li>
                <li>Developed RESTful APIs and microservices to power a data lake architecture and xAPI implementation.</li>
                <li>Ensured a seamless user experience (UX) through responsive web design and modern CSS frameworks.</li>
                <li>Collaborated with international teams across multiple time zones to align development strategies.</li>
                <li>Implemented best coding practices, conducted code reviews, and maintained comprehensive documentation.</li>
                <li>Led Agile development cycles, optimizing sprint planning and backlog prioritization.</li>
            </ul>

            <h3>Software Engineer</h3>
            <p>[Previous Company] | [Start Date] - [End Date]</p>
            <ul>
                <li>Developed and maintained enterprise-grade web applications focusing on scalability and security.</li>
                <li>Created modular and reusable components for large-scale applications using React and Angular.</li>
                <li>Built automated testing frameworks to improve software reliability and reduce bugs by 40%.</li>
                <li>Optimized database queries in MongoDB, enhancing application performance.</li>
                <li>Worked closely with UX/UI designers to ensure a visually appealing and user-friendly interface.</li>
            </ul>

            <h2>Education</h2>
            <p>Bachelor’s Degree in Computer Science / Software Engineering [University Name] | [Year of Graduation]</p>

            <h2>Certifications &amp; Training</h2>
            <ul>
                <li>AWS Certified Solutions Architect (Optional)</li>
                <li>React.js &amp; Node.js Advanced Development Course</li>
                <li>AI for Web Developers – Machine Learning Integration</li>
            </ul>

            <h2>Projects &amp; Contributions</h2>
            <ul>
                <li><strong>AI-Powered Learning Platform</strong> – Integrated NLP and ML to enhance personalized learning recommendations.</li>
                <li><strong>Enterprise-Grade LMS</strong> – Developed a scalable and secure Learning Management System (LMS).</li>
                <li><strong>Chatbot for e-Learning</strong> – Implemented a conversational AI interface for automated student engagement.</li>
            </ul>
        </div>
    </div>
</body>
</html>
`;

export default function ResumeHTMLRenderer() {
  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: "Professional_Resume",
  });

  return (
    <Container className="my-5 text-center">
      <Button variant="primary" onClick={handlePrint} className="mb-3">
        Download as PDF
      </Button>
      <div ref={resumeRef} dangerouslySetInnerHTML={{ __html: resumeHTML }} />
    </Container>
  );
}
