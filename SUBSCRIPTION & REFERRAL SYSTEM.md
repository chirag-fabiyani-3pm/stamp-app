---
# **Project: Subscription & Referral System**
### **Business Requirements Document (BRD)**

### **1. Overview**
This document outlines the business and functional requirements for a new subscription-based system. The system will include a referral program that converts users into "Dealers" and manages commission logic. [cite_start]It will also have a future provision for multi-tier commission on lottery ticket sales[cite: 4].

---
### **2. User Types**
[cite_start]The system will have two primary user types[cite: 6]:
* [cite_start]**Normal Subscriber:** Any user who directly subscribes to the application[cite: 9].
* [cite_start]**Dealer (Promoter):** A subscriber who has successfully referred 20 other paying subscribers[cite: 11].

---
### **3. Subscription Pricing Structure**
[cite_start]Subscription pricing is based on the number of countries a user selects[cite: 13, 53].

| Number of Countries | Monthly Price (Normal Subscriber) |
| :--- | :--- |
| 1 Country | $6.00 |
| 2 Countries | $8.00 |
| 3 Countries | $10.00 |
| All Countries | $12.00 |

#### **Dealer Pricing**
[cite_start]When a subscriber reaches 20 successful referrals, their subscription cost is reduced to **$2.00/month**, regardless of the number of countries they have selected[cite: 16, 24, 64].

---
### **4. Referral & Dealer Conversion Logic**
#### **4.1 Referral Token Mechanism**
[cite_start]Every new subscriber gets a unique referral token that can be entered by a new user during sign-up[cite: 19, 20]. [cite_start]Each successful referral is added to the referring user's total[cite: 21].

#### **4.2 Dealer Threshold**
[cite_start]When a user accumulates 20 referred and paying subscribers, they are automatically converted to Dealer status[cite: 23].

---
### **5. Commission Structure (Subscriptions)**
[cite_start]Any subscriber, even before becoming a dealer, can earn a **20% commission** on each active referral's subscription fee, starting from their very first referral[cite: 26, 27, 51]. [cite_start]For example, if a user refers someone who subscribes at $6/month, the referring user gets $1.20/month[cite: 29]. [cite_start]If they refer a user with a $10/month subscription, they get $2.00/month[cite: 30].

[cite_start]The commission is credited as a reward to the referring user's account balance and is not a subscription discount[cite: 32, 54]. [cite_start]Commissions will continue as long as the referred subscriber remains active[cite: 33].

---
### **6. Dealer + Commission Scenario**
[cite_start]After becoming a Dealer, a user continues to earn 20% commission on all their referred users' subscriptions in addition to their reduced subscription cost[cite: 35, 36, 37].

---
### **7. User Interface Requirements**
* **Sign-up Page:**
    * [cite_start]An input field for entering a referral token[cite: 41].
    * [cite_start]A brief explanation of referral benefits, such as the 20% commission and the $2/month dealer status at 20 referrals[cite: 43].
* **Dashboard:**
    * [cite_start]Display the user's referral count and monthly commission earnings[cite: 46, 47].
    * [cite_start]Show the current subscription tier and status (Normal or Dealer)[cite: 48].

---
### **8. Business Rules Summary**
* [cite_start]A user can be both a subscriber and a referrer simultaneously[cite: 50].
* [cite_start]Commission starts from the first referral[cite: 51].
* [cite_start]Dealer status is granted at 20 referrals[cite: 52].
* [cite_start]Subscription price is based on the number of countries selected[cite: 53].
* [cite_start]Commission is credited as cash rewards, not subscription discounts[cite: 54].

---
### **9. Acceptance Criteria**
* [cite_start]A user can subscribe with a selected number of countries[cite: 56].
* [cite_start]A user can generate and share a referral token[cite: 57].
* [cite_start]New users can apply a referral token upon sign-up[cite: 61].
* [cite_start]The referral count increases when a referred user pays for their subscription[cite: 62].
* [cite_start]A 20% commission is paid monthly to the referrer[cite: 63].
* [cite_start]When a user's referral count reaches 20, they become a Dealer, and their subscription drops to $2/month[cite: 64].
* [cite_start]The UI displays the referral count, earnings, and dealer status[cite: 65].