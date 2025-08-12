# Pharmacy Application Feature

## Overview
This feature allows users to apply for pharmacy roles in the Neo Health Card system, similar to the existing doctor application feature.

## Features Implemented

### Backend
1. **Models**:
   - `pharmacyApplication.js` - Stores pharmacy application data
   - `pharmacyModel.js` - Stores approved pharmacy information

2. **Controllers**:
   - `pharmacyController.js` - Handles pharmacy application submission and status checking
   - `adminPharmacyController.js` - Handles admin approval/rejection of applications

3. **Routes**:
   - `pharmacyRoute.js` - API endpoints for pharmacy applications

### Frontend (User Application)
1. **Page**: `PharmacyApplication.jsx` - User interface for applying as a pharmacy
2. **Route**: `/apply-pharmacy` - Protected route for pharmacy applications
3. **Navigation**: Added to sidebar menu

### Admin Panel
1. **Page**: `PharmacyApplication.jsx` - Admin interface for reviewing pharmacy applications
2. **Route**: `/pharmacyApplication` - Admin route for pharmacy application management
3. **Navigation**: Added to admin sidebar

## API Endpoints

### User Endpoints
- `POST /api/pharmacy/apply` - Submit pharmacy application
- `GET /api/pharmacy/check-status` - Check application status

### Admin Endpoints
- `GET /api/pharmacy/admin/pending-applications` - Get all pending applications
- `PUT /api/pharmacy/admin/application/:id/status` - Approve/reject application

## Application Fields
- Pharmacy Name
- License Number
- Address
- Phone Number
- Years of Experience
- Documents (License, Registration, etc.)

## Workflow
1. User fills out pharmacy application form
2. User uploads required documents (images/PDFs)
3. Application is submitted and stored as "pending"
4. Admin reviews application in admin panel
5. Admin can approve or reject the application
6. If approved, pharmacy record is created in the system
7. User can check their application status

## File Upload
- Uses Cloudinary for document storage
- Supports images and PDF files
- Documents are stored as URLs in the database

## Status Tracking
- `pending` - Application submitted, awaiting review
- `approved` - Application approved, pharmacy record created
- `rejected` - Application rejected
- `none` - No application submitted

## Security
- All endpoints require authentication
- Admin endpoints require admin role
- File upload validation
- Input validation and sanitization 