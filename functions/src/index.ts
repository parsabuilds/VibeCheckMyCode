import * as admin from 'firebase-admin';

admin.initializeApp();

export { githubOauth } from './github-oauth';
export { generateFix } from './generate-fix';
export { createPr } from './create-pr';
