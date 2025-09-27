# Drawing Backup System

This document explains the drawing backup system implemented in the Excalidraw app.

## Overview

The backup system automatically saves and loads user drawings to/from a Supabase database. When a user logs in, their most recent drawing is automatically loaded. As they draw, their work is automatically saved every 2 seconds.

## Features

- **Automatic Loading**: When a user logs in, their most recent backup is automatically loaded as the initial data for the Excalidraw component
- **Auto-Save**: Changes are automatically saved to the database every 2 seconds after the user stops drawing
- **User Isolation**: Users can only access their own backups due to Row Level Security policies
- **Performance**: Debounced saving prevents excessive database writes

## Database Setup

1. Run the SQL script in `database/setup.sql` in your Supabase SQL editor:

   ```sql
   -- This will create the drawing_backups table with proper RLS policies
   ```

2. Make sure your Supabase environment variables are set in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Code Structure

### Files Modified/Created

1. **`lib/backupService.ts`** - Core backup functionality

   - `loadBackup(userId)` - Loads the most recent backup for a user
   - `saveBackup(userId, drawingData)` - Saves drawing data to the database

2. **`App.tsx`** - Modified to integrate backup functionality

   - Added session prop to ExcalidrawWrapper
   - Added useEffect to load backup on user login
   - Added debounced auto-save in onChange handler

3. **`database/setup.sql`** - Database schema and security policies

### How It Works

1. **Login Detection**: The `useEffect` hook monitors `session?.user?.id` changes
2. **Backup Loading**: When a user logs in, `loadBackup()` is called with their user ID
3. **Scene Update**: If backup data exists, it's set as initialData using `excalidrawAPI.updateScene()`
4. **Auto-Save**: The `onChange` handler calls a debounced `saveBackup()` function
5. **Data Persistence**: Drawing data (elements, appState, files) is stored as JSONB in Supabase

## Usage

Once implemented, the backup system works automatically:

1. **User logs in** → Their previous drawing loads automatically
2. **User draws/edits** → Changes are auto-saved every 2 seconds
3. **User logs out and back in** → Their work is restored
4. **Backup status** → Visual indicator shows backup status in bottom-right corner

### Visual Indicators

- **Loading**: Yellow indicator with "Loading backup..." when fetching saved data
- **Saved**: Green indicator showing "Saved Xm ago" when backup is successful
- **Error**: Red indicator with "Backup failed" when there are issues

### Manual Testing

To test the backup system:

1. Log in to the application
2. Create some drawings/elements
3. Wait 2+ seconds for auto-save
4. Refresh the page or log out and back in
5. Your drawing should be restored automatically

## Database Schema

```sql
CREATE TABLE drawing_backups (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  drawing_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);
```

## Security

- Row Level Security (RLS) ensures users can only access their own backups
- Foreign key constraint ensures data integrity with user accounts
- Automatic cleanup when user accounts are deleted (CASCADE)

## Performance Considerations

- Debouncing prevents excessive saves during active drawing
- JSONB storage allows efficient querying of drawing data
- Indexes on user_id and updated_at optimize common queries
- Upsert operations prevent duplicate records per user
