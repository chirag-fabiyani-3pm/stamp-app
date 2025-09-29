# ✅ Stamp API Data Fetcher - COMPLETED

**Status: ✅ Successfully fetched 15,124 stamps (100% complete)**

This script fetches all stamp data from the Decoded Stamp API and creates an NDJSON file containing all stamps.

## ✅ Completed Results

- **✅ 15,124 stamps fetched** (exactly matching API total)
- **✅ 91 MB NDJSON file** generated
- **✅ 76 pages processed** (200 stamps per page)
- **✅ 100% completion rate**
- **✅ All authentication and API issues resolved**

## Overview

The script performs the following steps:
1. **Authenticates** with the API using provided credentials
2. **Fetches stamp data** in paginated requests (200 stamps per page)
3. **Writes data** to an NDJSON file (one JSON object per line)
4. **Validates results** and provides detailed reporting

## Usage

### Quick Start
```bash
# Run the script
npm run fetch-stamps

# Or run directly
node scripts/fetch-stamp-api-data.js
```

### Expected Output
- **File**: `stamp_master_catalog.ndjson` (in project root)
- **Format**: NDJSON (one JSON object per line)
- **Expected Count**: ~15,124 stamps
- **File Size**: ~50-100 MB (estimated)

## Configuration

The script uses these default settings:

```javascript
const API_BASE_URL = 'https://decoded-app-stamp-api-dev.azurewebsites.net';
const CREDENTIALS = {
    username: "harshit@decoded.digital",
    password: "harshit",
    deviceId: "stamp-fetcher-script",
    isAppleDevice: true
};
const CATALOG_EXTRACTION_PROCESS_ID = "3129b91b-df8f-42fe-8dfd-8f7dd64154d6";
const PAGE_SIZE = 200;
```

## API Endpoints Used

1. **Authentication**: `POST /api/v1/Session`
2. **Stamp Data**: `GET /api/v1/StampMasterCatalog`

## Features

### 🔐 Authentication
- Automatic login and token management
- Bearer token authentication for subsequent requests

### 📄 Pagination
- Automatic pagination handling
- Configurable page size (default: 200 stamps per page)
- Progress tracking with page numbers

### 🛡️ Error Handling
- Retries on individual page failures
- Graceful handling of network errors
- Detailed error logging

### 📊 Progress Monitoring
```
🌐 Making request to: https://decoded-app-stamp-api-dev.azurewebsites.net/api/v1/Session
✅ Authentication successful!
🎫 Token: eyJhbGciOiJIUzI1NiIs...
📄 Fetching page 1 (200 stamps per page)...
✅ Page 1: Received 200 stamps
✅ Page 1 processed. Total stamps so far: 200
📄 Fetching page 2 (200 stamps per page)...
```

### 📈 Results Validation
```
📊 FETCH RESULTS:
================
✅ Total stamps fetched: 15124
🎯 Expected stamps: 15124
📄 Pages processed: 76
📁 Output file: stamp_master_catalog.ndjson
💾 File size: 87.42 MB
📝 Lines in file: 15124
✅ File line count matches fetched count
📈 Completion: 100.0%
🎉 SUCCESS: Fetched majority of expected stamps!
```

## Output Format

The script creates an **NDJSON** file where each line contains a complete stamp record:

```json
{"id":"123","name":"Example Stamp","country":"USA","year":1990,"denomination":"25c"}
{"id":"124","name":"Another Stamp","country":"UK","year":1995,"denomination":"1st"}
{"id":"125","name":"Third Stamp","country":"Canada","year":2000,"denomination":"$1"}
```

## Safety Features

### 🔄 Graceful Interruption
- Press `Ctrl+C` to stop the script safely
- Partial results will be preserved
- Progress report will be shown

### 🛡️ API Rate Limiting
- 500ms delay between requests
- Respectful to API server resources

### 🔍 Data Validation
- Checks for expected number of stamps
- Validates file integrity
- Reports completion percentage

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   ```
   ❌ Authentication failed: No token received
   ```
   - Check credentials in the script
   - Verify API endpoint is accessible

2. **Network Errors**
   ```
   ❌ Request failed: HTTP 500: Internal Server Error
   ```
   - Check internet connection
   - Verify API server is online
   - Try running the script again (it will resume from where it left off)

3. **Incomplete Data**
   ```
   ⚠️ WARNING: Fetched fewer stamps than expected
   ```
   - Normal if the API has fewer stamps than expected
   - Check the actual vs expected count in the results

### Manual Verification

To verify the NDJSON file:

```bash
# Count lines (should match stamp count)
wc -l stamp_master_catalog.ndjson

# Check first few records
head -n 3 stamp_master_catalog.ndjson

# Validate JSON format
head -n 1 stamp_master_catalog.ndjson | jq .
```

## Integration

The fetched data can be used to:
- Update the local stamp database
- Import into vector stores
- Analyze stamp collection data
- Sync with other stamp catalog systems

## File Structure

```
stamp_master_catalog.ndjson    # Main output file
scripts/
  ├── fetch-stamp-api-data.js  # Main script
  └── STAMP_API_FETCHER_README.md  # This file
```

## Dependencies

The script uses only Node.js built-in modules:
- `fs` - File system operations
- `path` - Path utilities
- `fetch` - HTTP requests (Node.js 18+)

No additional npm packages required!
