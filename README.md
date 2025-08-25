# 💊HospitalHub

## 📌 Project Overview
HospitalHub is a **medicine inventory management system** powered by **AI recommendations**.  
Admins can **Create, Read, Update, Delete (CRUD)** medicines in stock while the AI predicts what medicines should be restocked, removed, or added.  
The goal is to help hospitals maintain **optimized medicine inventories** with minimal guesswork.
---

## 🛠 Tech Stack
- **Frontend:** Next.js (JavaScript) + TailwindCSS + shadcn/ui  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **AI Layer:** LangChain.js (agentic AI for CRUD suggestions)  

---

## ⚙️ Features
- **Inventory Management**
  - View all medicines in stock
  - Add/Edit/Delete medicines
- **AI Recommendations**
  - Suggests medicines to reorder, add, or remove
  - Provides confidence score & reasoning
  - Admin can **apply** suggestions with one click
- **Visual Dashboard**
  - Clean UI with shadcn components
  - Charts for demand trends
  - Summary stats for quick insights
---

## 🔄 Workflow
1. **Admin CRUDs inventory** via Next.js frontend.  
2. **Backend** saves medicines & stock in MongoDB.  
3. **AI Service (LangChain.js)**:
   - Reads inventory & past usage
   - Calculates reorder points
   - Suggests CRUD actions  
4. **Recommendations API** returns suggestions to frontend.  
5. **Admin applies changes** → Inventory updates instantly.

---
