# VaidyaVaani Design Description

**Version:** 1.0\
**Date:** July 11, 2026

------------------------------------------------------------------------

# Overview

VaidyaVaani is designed as a trustworthy, modern, and accessible
healthcare platform. The visual language emphasizes clarity, simplicity,
and confidence while making complex medical information easy to
understand.

------------------------------------------------------------------------

# Design Principles

-   Simple over complex
-   Calm and reassuring
-   Accessibility-first
-   Mobile-first responsive design
-   Minimal cognitive load
-   Consistent spacing and typography
-   Fast navigation with few clicks

------------------------------------------------------------------------

# Brand Personality

-   Trustworthy
-   Intelligent
-   Caring
-   Professional
-   Modern
-   Inclusive

------------------------------------------------------------------------

# Color Palette

## Primary

-   Medical Blue: `#0A84FF`
-   Healthcare Green: `#22C55E`

## Secondary

-   Soft Sky: `#EAF4FF`
-   Light Mint: `#ECFDF5`

## Neutral

-   Background: `#F8FAFC`
-   Surface: `#FFFFFF`
-   Border: `#E2E8F0`
-   Text Primary: `#0F172A`
-   Text Secondary: `#64748B`

## Status Colors

-   Success: `#16A34A`
-   Warning: `#F59E0B`
-   Error: `#DC2626`
-   Info: `#3B82F6`

------------------------------------------------------------------------

# Typography

-   Headings: Poppins
-   Body: Inter
-   Code/Data: JetBrains Mono

Scale: - H1 40px - H2 32px - H3 24px - Body 16px - Caption 14px

------------------------------------------------------------------------

# Iconography

Rounded outline icons with healthcare symbolism: - Reports -
Prescriptions - Medicine - Heart - Upload - AI Assistant - Voice -
Timeline - Settings

------------------------------------------------------------------------

# Layout

## Desktop

-   Left navigation sidebar
-   Top app bar
-   Responsive content area
-   Right contextual panel (optional)

## Mobile

-   Bottom navigation
-   Sticky action button for Upload
-   Card-based scrolling interface

------------------------------------------------------------------------

# Navigation

-   Dashboard
-   Reports
-   Prescriptions
-   Medicine Checker
-   Timeline
-   AI Assistant
-   Profile
-   Settings

------------------------------------------------------------------------

# Dashboard

Displays:

-   Greeting
-   Upload CTA
-   Recent reports
-   Active medicines
-   Interaction alerts
-   Health summary cards
-   Quick AI actions

------------------------------------------------------------------------

# Upload Experience

Supported: - Camera - Gallery - PDF

Flow:

Select → Preview → Upload → OCR → AI Processing → Summary

Progress indicators show each processing stage.

------------------------------------------------------------------------

# Report Summary Screen

Sections:

-   Overall status
-   Key findings
-   Abnormal values
-   Explanation in plain language
-   Recommendations
-   Voice playback
-   Translate

Critical results are highlighted using status colors.

------------------------------------------------------------------------

# Prescription Screen

Each medicine appears as a card showing: - Name - Purpose - Dosage -
Timing - Food instructions - Warnings

Interaction badges indicate Low, Moderate, High, or Critical risk.

------------------------------------------------------------------------

# Timeline

Chronological medical history with filters: - Reports - Prescriptions -
Diagnoses - Medicines

Users can open any record from the timeline.

------------------------------------------------------------------------

# AI Assistant

Chat interface supporting: - Health questions - Report explanations -
Medicine guidance - Context-aware responses using uploaded records

------------------------------------------------------------------------

# Accessibility

-   WCAG-inspired color contrast
-   Keyboard navigation
-   Screen reader labels
-   Adjustable text size
-   Voice narration
-   Large touch targets

------------------------------------------------------------------------

# Motion

Subtle animations only: - Fade-in cards - Smooth page transitions -
Upload progress - Loading skeletons - Success micro-interactions

------------------------------------------------------------------------

# Responsive Breakpoints

-   Mobile: \<768px
-   Tablet: 768--1023px
-   Desktop: ≥1024px

------------------------------------------------------------------------

# Component Library

-   Buttons
-   Cards
-   Inputs
-   File uploader
-   Alerts
-   Progress bars
-   Tabs
-   Badges
-   Chips
-   Timeline
-   Modal dialogs
-   Toast notifications

------------------------------------------------------------------------

# Security UX

-   Secure upload indicators
-   Privacy notices
-   Session timeout warning
-   Confirmation before deleting records

------------------------------------------------------------------------

# Empty States

Friendly illustrations with concise guidance for: - No reports - No
prescriptions - No interaction history

------------------------------------------------------------------------

# Error States

Clear, actionable messages for: - Upload failure - OCR failure - AI
processing error - Network issues

Retry options should always be visible.

------------------------------------------------------------------------

# Future Enhancements

-   Dark mode
-   Family accounts
-   Doctor dashboard
-   Wearable integration
-   Personalized health insights

------------------------------------------------------------------------

# Design Goal

Every screen should help users understand their health quickly, reduce
anxiety, and make informed decisions through clear language, intuitive
navigation, and a clean healthcare-focused interface.
