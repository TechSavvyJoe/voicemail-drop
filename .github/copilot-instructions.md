<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Voicemail Drop Application - Copilot Instructions

This is a Next.js TypeScript application for car dealership salespeople to manage voicemail drop campaigns.

## Application Context

- **Purpose**: Automated voicemail campaigns for car dealerships
- **Users**: Car dealership sales staff  
- **Key Features**: Customer list upload, campaign management, analytics
- **Framework**: Next.js 15 with App Router, TypeScript, Tailwind CSS

## Code Style Guidelines

- Use TypeScript for all components and utilities
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling (avoid inline styles)
- Implement proper error handling and loading states
- Use Lucide React for icons consistently
- Follow Next.js App Router conventions

## Business Logic

- Customer data must include: firstName, lastName, phoneNumber (required)
- Optional fields: email, vehicleInterest, lastContact
- Phone numbers should be validated with basic regex
- Voicemail scripts should be under 30 seconds (approximately 150 words)
- Best delivery times: 10 AM - 2 PM and 4 PM - 6 PM
- Support CSV and Excel file uploads for customer lists

## Component Patterns

- Use consistent navigation header across pages
- Implement proper form validation with user feedback  
- Show loading states for async operations
- Use toast notifications for user actions
- Implement responsive design for mobile/desktop

## API Integration Notes

- This is currently a frontend-only demo with mock data
- API endpoints would typically handle file uploads, campaign management, and analytics
- Consider TCPA compliance for actual voicemail delivery
- Implement proper authentication for production use

## File Organization

- Components in `/src/components/`
- Pages follow App Router structure in `/src/app/`
- Shared utilities in `/src/lib/` (when needed)
- Types in dedicated interfaces within component files
