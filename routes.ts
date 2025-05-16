/**
 * An array of routes that are accessible to the public
 * These routes do not required authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/api/uploadthing"];

/**
 * An array of routes that are used to the authentication
 * These routes will redirect in user to Dashboard
 * @type {string[]}
 */

export const authRoutes = [
  "/",
];

/**
 * The prefix for API authentication routes
 * These routes will redirect in user to Dashboard
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";
export const apiUploadPrefix = "/api/uploadthing";

/**
 * The default path invoke
 * @type {string}
 */
export const DEFAULT_REDIRECT = "/";
