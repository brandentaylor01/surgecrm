import fs from 'fs';
import nodemailer from 'nodemailer';
import chalk from 'chalk';
import 'dotenv/config';

const DB_FILE = 'leads.json';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '://gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER || 'branden@hirerainmakers.com',
    pass: process.env.SMTP_PASS || ''
  }
});

function getLocalDB() {
  if (!fs.existsSync(DB_FILE) || fs.readFileSync(DB_FILE, 'utf-8').trim() === '') {
    return [
      { id: 1, companyName: "Buckeye Roofing Group", industry: "Roofing Services", email: "contact@buckeyeroofingcolumbus.com", crmStatus: "Local Lock-On Active" },
      { id: 2, companyName: "Apex Marketing Experts", industry: "Marketing Services", email: "contact@apexmarketingcleveland.com", crmStatus: "Local Lock-On Active" },
      { id: 3, companyName: "Midwest Logistics Hub", industry: "Logistics 3PL Services", email: "info@midwestlogisticsdayton.com", crmStatus: "Local Lock-On Active" }
    ];
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveToDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function runOutreachSequence() {
  console.clear();
  console.log(chalk.cyan.bold(`
  ⚡ SURGECRM AUTONOMOUS OUTBOUND ENGINE v1.3
  ======================================================
  Client Acquisition System for: Rainmaker Sales LLC
  `));

  let db = getLocalDB();
  const targetLeads = db.filter(l => l.email && (l.crmStatus === "Local Lock-On Active" || l.crm_status === "Local Lock-On Active"));

  if (targetLeads.length === 0) {
    console.log(chalk.yellow('[-] No pending leads with active "Local Lock-On" tags found requiring outreach execution.'));
    process.exit(0);
  }

  console.log(chalk.yellow(`[+] Initiating outreach transmission array for ${targetLeads.length} target records...\n`));

  // If the .env file hasn't been set up yet, the system gracefully defaults to showing a dry-run log layout
  const isDryRun = !process.env.SMTP_PASS;
  if (isDryRun) {
    console.log(chalk.red.bold('[-] Warning: SMTP Password missing from .env file.\nRUNNING ENGINE IN SAFE "DRY-RUN" PREVIEW MODE.\n'));
  }

  for (let lead of targetLeads) {
    const emailSubject = `Outsourced sales operations for ${lead.companyName}`;
    const emailBody = `Hi there,\n\nI was looking over some prominent businesses in Ohio and came across ${lead.companyName}.\n\nWe run a sales agency called Rainmaker Sales LLC (hirerainmakers.com). Companies in the ${lead.industry || 'B2B'} space hire our team to completely take over and run their entire sales operations for them—handling everything from prospecting to closing deals so you can focus entirely on delivery.\n\nAre you open to a brief chat this week to see how we can handle your pipeline generation and scale your revenue?\n\nBest,\nBranden Taylor\nRainmaker Sales LLC\nhirerainmakers.com`;

    if (isDryRun) {
      console.log(chalk.blue(`--------------------------------------------------`));
      // FIXED: Visual templates now explicitly reflect your direct business routing address configuration
      console.log(chalk.white(`📬 FROM    : Branden Taylor <branden@hirerainmakers.com>`));
      console.log(chalk.white(`📬 TARGET  : ${lead.companyName} (${lead.email})`));
      console.log(chalk.white(`📋 SUBJECT : ${emailSubject}`));
      console.log(chalk.gray(`\n${emailBody}\n`));
      console.log(chalk.yellow(`[DRY-RUN] Script simulated dispatch successfully.`));
    } else {
      try {
        await transporter.sendMail({
          from: `"Branden Taylor" <branden@hirerainmakers.com>`,
          replyTo: 'branden@hirerainmakers.com',
          to: lead.email,
          subject: emailSubject,
          text: emailBody
        });
        
        lead.crmStatus = "Pitch Dispatched via Terminal";
        if(lead.crm_status) lead.crm_status = "Pitch Dispatched via Terminal";
        console.log(chalk.green(`[✓] Dispatch successful: Sent outsourced sales pitch to ${lead.email}`));
      } catch (err) {
        console.log(chalk.red(`[-] Transmission failure for ${lead.companyName} (${lead.email}): ${err.message}`));
      }
    }

    await new Promise(res => setTimeout(res, 1500));
  }

  if (!isDryRun) {
    saveToDB(db);
    console.log(chalk.green.bold('\n[✓] ALL PENDING OUTBOUND SEQUENCES TRANSMITTED SUCCESSFULLY.'));
  }
}

runOutreachSequence();
