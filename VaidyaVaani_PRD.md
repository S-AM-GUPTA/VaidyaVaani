# Product Requirements Document (PRD)

# VaidyaVaani

**Version:** 1.0\
**Status:** Draft\
**Author:** ChatGPT (for Manu)\
**Date:** July 11, 2026

------------------------------------------------------------------------

# 1. Product Overview

## Vision

VaidyaVaani is an AI-powered healthcare assistant that converts complex
medical reports and prescriptions into simple, understandable
explanations in regional languages while helping users avoid dangerous
medicine interactions across multiple prescriptions.

## Problem Statement

Millions of patients: - Cannot understand medical terminology. - Forget
dosage instructions. - Take medicines from multiple doctors without
checking interactions. - Struggle with English medical reports. -
Elderly and rural patients often need assistance understanding
prescriptions.

VaidyaVaani aims to bridge this gap using AI.

------------------------------------------------------------------------

# 2. Goals

### Primary Goals

-   Explain prescriptions in simple language.
-   Summarize laboratory reports.
-   Detect medicine interactions.
-   Support Indian regional languages.
-   Build a secure medical record vault.

### Success Metrics

-   90% report summarization accuracy

-   \<5 second AI response

-   85% user satisfaction

-   80% interaction detection recall

-   95% successful OCR extraction

------------------------------------------------------------------------

# 3. Target Users

## Primary

-   General patients
-   Elderly people
-   Rural users
-   Chronic disease patients

## Secondary

-   Family caregivers
-   Clinics
-   Pharmacists

------------------------------------------------------------------------

# 4. Core Features

## 4.1 Secure Authentication

-   Email OTP login
-   JWT authentication
-   Profile management

------------------------------------------------------------------------

## 4.2 Prescription Upload

Supports:

-   Image
-   PDF
-   Camera scan

Processing:

Upload → OCR → AI Analysis → Storage

------------------------------------------------------------------------

## 4.3 Medical Report Upload

Examples:

-   Blood Test
-   CBC
-   Diabetes
-   Lipid Profile
-   Thyroid
-   X-Ray Reports
-   MRI Reports

AI extracts:

-   Key findings
-   Abnormal values
-   Severity
-   Next recommendations

------------------------------------------------------------------------

## 4.4 AI Report Summary

Example output:

High blood sugar detected.

Possible indication: Type 2 Diabetes

Recommendation: Visit a physician.

Avoid: High sugar foods.

------------------------------------------------------------------------

## 4.5 Prescription Explanation

Explain:

Medicine Name

Purpose

Dosage

Timing

Food instructions

Warnings

Example:

Paracetamol 650mg

Purpose: Reduce fever.

Take: One tablet after food every 6 hours.

Avoid: Alcohol.

------------------------------------------------------------------------

## 4.6 Medicine Interaction Detection

Unique feature.

User uploads multiple prescriptions.

System stores medicine history.

Every new upload checks:

-   Drug interactions
-   Duplicate medicines
-   Overdose risk
-   Allergy conflicts

Severity:

-   Low
-   Moderate
-   High
-   Critical

------------------------------------------------------------------------

## 4.7 Medical History Timeline

Chronological timeline of:

-   Prescriptions
-   Reports
-   Diagnoses
-   Medicines

------------------------------------------------------------------------

## 4.8 Regional Language Support

Initial languages:

-   Hindi
-   English

Future:

-   Bengali
-   Tamil
-   Telugu
-   Marathi
-   Gujarati

------------------------------------------------------------------------

## 4.9 Voice Narration

Read reports aloud.

Supports elderly users.

------------------------------------------------------------------------

## 4.10 AI Chat Assistant

Ask questions like:

"What is HbA1c?"

"Can I eat mango?"

"Why is cholesterol high?"

Uses uploaded reports as context.

------------------------------------------------------------------------

# 5. User Flow

Register/Login

↓

Upload Report

↓

OCR

↓

AI Processing

↓

Summary

↓

Medicine Check

↓

History Saved

↓

Voice + Regional Language

------------------------------------------------------------------------

# 6. Functional Requirements

## Authentication

-   OTP verification
-   JWT sessions
-   Passwordless login

## OCR

-   Extract text from images
-   Extract tables
-   PDF parsing

## AI Engine

-   Report summarization
-   Prescription explanation
-   Drug interaction detection
-   Recommendation generation

## Storage

-   User profiles
-   Reports
-   Prescriptions
-   AI summaries
-   Medicine history

------------------------------------------------------------------------

# 7. Non-Functional Requirements

-   End-to-end encryption
-   Responsive UI
-   Cloud storage
-   Fast API responses
-   Accessibility
-   Audit logging

------------------------------------------------------------------------

# 8. Tech Stack

Frontend

-   React
-   TypeScript
-   Tailwind CSS
-   React Router

Backend

-   Node.js
-   Express
-   TypeScript

Database

-   MongoDB Atlas

AI

-   Gemini/OpenAI compatible LLM
-   OCR (Google Vision/Tesseract)
-   Drug interaction knowledge base

Infrastructure

-   Docker
-   Render
-   Vercel
-   GitHub Actions

------------------------------------------------------------------------

# 9. API Modules

-   Auth Service
-   OCR Service
-   AI Service
-   Report Service
-   Prescription Service
-   Medicine Service
-   User Service
-   Timeline Service

------------------------------------------------------------------------

# 10. Database Collections

Users

Reports

Prescriptions

Medicines

Interactions

Summaries

Sessions

------------------------------------------------------------------------

# 11. Security

-   HTTPS
-   JWT
-   Encryption at rest
-   Secure file uploads
-   Input validation
-   Rate limiting

------------------------------------------------------------------------

# 12. Future Roadmap

Phase 2

-   Doctor dashboard
-   Hospital integration
-   WhatsApp report upload
-   Appointment booking

Phase 3

-   Wearable integration
-   Health trends
-   Predictive risk analysis
-   Family health accounts

------------------------------------------------------------------------

# 13. Risks

-   OCR quality for handwritten prescriptions
-   AI hallucinations
-   Drug database freshness
-   Regulatory compliance

------------------------------------------------------------------------

# 14. MVP Scope

Included: - Authentication - Report upload - Prescription upload - OCR -
AI summaries - Medicine interaction detection - Medical history -
Hindi + English - Voice narration

Excluded: - Doctor consultations - Insurance - Pharmacy ordering -
Wearables

------------------------------------------------------------------------

# 15. Long-Term Vision

VaidyaVaani will become an AI-powered personal health companion that
securely stores lifelong medical records, explains every report in plain
language, proactively warns users about unsafe medicine combinations,
and makes healthcare understandable and accessible for every Indian
regardless of language or medical literacy.
