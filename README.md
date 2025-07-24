# 🔐 Secure File Sharing App (React + AWS Amplify)

A secure, full-stack file-sharing web app built with **React**, powered entirely by **AWS free-tier services** using **Amplify, S3, DynamoDB, and AppSync**.

> ✔️ Upload files  
> ✔️ Set expiration time  
> ✔️ (Optional) Add password protection  
> ✔️ Share auto-expiring secure download link

---

## 📸 Demo

🌐 [**Live URL** →](https://main.dtx18klq7o12j.amplifyapp.com/)  

---

## 🚀 Features

- ✅ Upload any file securely to AWS S3  
- 🔐 Optional password protection  
- ⏱ Expiry system (10 mins → 7 days)  
- 🔗 Shareable link: auto-expired if time passes  
- 🌐 Fully deployed using **Amplify Console**  
- ☁️ No Lambda / API Gateway used (simplified architecture)

---

## 🛠 Tech Stack

| Frontend       | Backend (Serverless)  | AWS Services Used              | DevOps Tools        |
|----------------|------------------------|--------------------------------|----------------------|
| React (CRA)    | GraphQL via AppSync    | ✅ S3 (file storage)           | ✅ GitHub            |
| HTML, CSS      | DynamoDB (metadata DB) | ✅ DynamoDB (file metadata)    | ✅ Amplify CI/CD     |
| Amplify UI     | Amplify Storage & API  | ✅ AppSync (GraphQL endpoint)  |                      |
| React Router   |                        | ✅ Amplify Hosting & Console   |                      |

---

## ⚙️ Project Structure

```

secure-file-share/
├── amplify/                # Backend infra (S3, API, etc.)
├── public/
├── src/
│   ├── components/
│   │   ├── UploadForm.js
│   │   ├── DownloadPage.js
│   │   └── LinkResult.js
│   ├── graphql/            # Auto-generated schema, queries
│   ├── App.js
│   ├── index.js
│   └── aws-exports.js
├── .gitignore
├── package.json
├── README.md
└── amplify.yml            # Build settings (auto)

````

---

## 🔄 How It Works

1. **User uploads file** via React UI  
2. File is saved to AWS **S3** with a unique key  
3. File metadata (ID, expiry, optional password) is saved to **DynamoDB**  
4. User gets a **unique shareable link** (e.g. `/download/xyz123`)  
5. Anyone with the link can download the file until it expires  
6. If expired or password is incorrect → error shown

---

## 📦 Installation (Dev Mode)

```bash
git clone https://github.com/your-username/secure-file-share.git
cd secure-file-share
npm install
amplify pull --appId YOUR_APP_ID
npm start
````

> 🔧 You'll need to [install Amplify CLI](https://docs.amplify.aws/cli/start/) and configure using `amplify configure`.

---

## 🚢 Deployment (One-Time Setup)

### ✅ 1. Push Frontend + Backend

```bash
amplify push
```

### ✅ 2. Publish Live Site

```bash
amplify publish
```

Auto-deploy will also occur on GitHub push via Amplify Console CI/CD.

---

## 🔐 Security

* Files are **NOT public**
* Downloads require:
  ✅ Expiry check
  ✅ Password match (if set)
* All access via **pre-signed S3 URLs**
* Protected using Cognito Auth Roles (IAM)

---

## 📅 Expiry Options

| Option     | Value   |
| ---------- | ------- |
| 10 Minutes | `10`    |
| 30 Minutes | `30`    |
| 1 Hour     | `60`    |
| 1 Day      | `1440`  |
| 1 Week     | `10080` |

---

## 📖 Application Outcomes

✅ Hands-on with:

* AWS Amplify (hosting, API, storage)
* GraphQL + AppSync
* Cognito IAM roles
* React file handling
* CI/CD with GitHub → Amplify

---

## 🤝 Acknowledgements

* Built using AWS Free Tier services
* Designed by **Adithya Prathi**, 4th Year CSE
* Made for hands-on DevOps + React application

---
