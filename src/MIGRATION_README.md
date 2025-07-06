# Migrating from Firebase to Local Storage

This guide explains the migration from Firebase Firestore to local JSON files for storing recipient data in the Woody Prieb Dharmoscience Series Book Donation Campaign application.

## Overview

Due to budget constraints, we've migrated the storage of recipient data from Firebase Firestore to a local storage-based solution. This approach:

1. Uses JSON files as the initial data source
2. Uses browser localStorage for persistence
3. Maintains the same API/interface for components that use recipient data

## Files Created/Modified

- `src/data/recipients.json` - Initial recipient data
- `src/data/regions.json` - Initial region data
- `src/services/dataService.js` - Service to handle data persistence using localStorage
- `src/services/recipientService.js` - Service to provide the same API as before but using local data
- `src/stores/recipientStore.js` - Updated to use the new services instead of Firebase
- `src/scripts/importSampleRecipients.js` - Updated to use local storage instead of Firebase
- `src/views/admin/RecipientManagementView.vue` - Updated import sample function
- `src/views/user/DonationView.vue` - Updated recipient retrieval functions
- `src/views/admin/AdminSelectionView.vue` - Updated recipient and country fetching

## How It Works

1. The application loads initial data from JSON files on startup
2. Data is stored in localStorage for persistence between page reloads
3. All CRUD operations work through the service layer, which handles the persistence
4. The Pinia store and component interfaces remain the same, so no changes are needed in views or components

## Implementation Details

### Data Storage

- Initial data is defined in JSON files in the `src/data/` directory
- Data is persisted in the browser's localStorage
- Each entity has a unique ID for lookup and updates

### Service Layer

- `dataService.js` - Handles raw data operations and persistence
- `recipientService.js` - Provides business logic and maintains the same API as the previous Firebase implementation

### Limitations

- Data is stored locally in the browser, not in a central database
- Different users or devices will have their own separate data
- Data size is limited by localStorage capacity (typically 5-10MB per domain)
- This is a temporary solution until budget allows for a proper database

## Known Issues

1. **Linter/CSS Errors**: You may see "Unknown word (CssSyntaxError)" errors in the files. These are related to the IDE configuration and don't affect the functionality.

2. **Firebase import paths**: We've changed imports from `@/services/...` to `../services/...` to avoid path resolution issues. If you encounter import errors, check the path structure.

3. **Server-side code**: The Firebase removal only affects client-side recipient handling. Server-side Firebase Functions may still need Firebase for other features.

## Remaining Firebase Dependencies

The following features still use Firebase and have not been migrated:

1. Authentication
2. Order/Donation management
3. Shipment tracking
4. Admin user management

These features remain in Firebase as they are central to the application's functionality and would require more extensive changes to migrate.

## Future Improvements

If more budget becomes available:

1. Migrate back to Firebase or another cloud database
2. Implement a simple backend API with a lightweight database like SQLite
3. Consider using IndexedDB for larger local storage if needed

## Testing

The application should function the same as before, but with data stored locally rather than in Firebase. If any issues are encountered, please check the browser console for errors.

## Complete Firebase Removal (Optional)

If you want to completely remove Firebase dependencies for recipient functionality:

1. Look for any remaining imports from `firebase/firestore` in your components
2. Replace direct Firebase queries with calls to the appropriate service methods
3. Remove `collection`, `where`, `orderBy`, etc. imports if they're only used for recipient queries

For components with mixed responsibilities (using Firebase for other features), be careful to only remove the recipient-related Firebase code.
