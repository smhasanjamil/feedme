# Cart API Troubleshooting Guide

## Recent Fixes

### Hydration Mismatch Resolved
We've fixed the hydration mismatch error by ensuring consistent HTML structure between server and client rendering.
All cart page states (loading, error, empty, and filled) now have the same basic structure with consistent heading
hierarchy and layout.

## Common Issues and Solutions

### 1. "All endpoint patterns failed" Error

**Issue**: When clicking the minus button or attempting to update cart quantities, you see an error in the console:
```
Error: All endpoint patterns failed. Last error: {}
```

**Cause**: This occurs when none of the API endpoint patterns match the actual backend API structure or when the backend is unavailable.

**Solutions**:

1. **Check Backend API**: Ensure your backend API is running at the URL specified in `.env.local` file.

2. **Verify Endpoint Structure**: The cart API is attempting to find the correct endpoint pattern from several possibilities. 
   If your backend uses a different pattern, you'll need to add it to the list in `redux/features/cart/cartApi.ts`.

3. **Local State**: The application will update the local state even if the API call fails, so the UI remains functional.
   However, changes won't be saved on the server until the API is working properly.

### 2. Hydration Mismatch Errors

**Issue**: You see errors about hydration mismatches between server and client rendering.

**Cause**: This happens when the HTML structure rendered on the server differs from what is rendered on the client.

**Solution**: We've fixed these issues by:

1. Ensuring consistent HTML structure on both server and client
2. Adding proper heading hierarchy in all states of the cart page
3. Using React state instead of global variables for feature flags
4. Making all conditional branches render the same base structure

## Error Handling Strategy

The cart implementation uses a "local-first" approach to error handling:

1. Local state is updated immediately for a responsive user experience
2. API calls are made in the background to sync with the server
3. If API calls fail, the UI continues to work with the local state
4. Console errors are logged for debugging, but user experience is not disrupted

## Debugging Strategies

1. **Check Network Requests**: Use browser dev tools to see what API requests are being made
2. **Console Logs**: Look for detailed logs about endpoint attempts in the console
3. **Environment Variables**: Verify your `.env.local` has the correct API URL

## Backend API Requirements

To make the API work with this application, your API needs to implement at least one of these endpoint patterns:

- `/cart/{itemId}?email={email}` - For updating/removing cart items
- `/cart/items/{itemId}?email={email}` - Alternative with items collection
- `/cart/item/{itemId}?email={email}` - Alternative with singular item
- `/cart/update-quantity/{itemId}?email={email}` - With explicit update action
- `/cart-items/{itemId}?email={email}` - With hyphenated collection name
- `/carts/{itemId}?email={email}` - With plural collection name

These endpoints should:
- Accept DELETE requests for removing items
- Accept PATCH requests with a `{ quantity: number }` body for updating quantities

## Contact Support

If you continue to experience issues after trying these solutions, please create an issue in the GitHub repository with:

1. A detailed description of the error
2. Steps to reproduce
3. Screenshots of any error messages
4. Your environment details (browser, OS, Node version) 