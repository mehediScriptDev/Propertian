# DEV: Reverting Dev Partner Impersonation & Enabling Real Partner Login

Date: 2025-11-20

This document explains how to safely remove the development-only partner impersonation helper (devImpersonate + DevPartnerLogin) and how to restore/use the real backend login for partner users.

Sections

- Quick revert (what to delete)
- How to verify real partner login works
- Code snippets for removal
- Checklist before merging to main
- Troubleshooting

---

## Quick Revert (remove dev helper)

If you added the dev impersonation helper to speed local testing, remove it before shipping. These are the files/changes to remove:

- `src/components/auth/DevPartnerLogin.jsx` — delete this file.
- `src/contexts/AuthContext.jsx` — remove the `devImpersonate` function and its entry in the exported context `value`.
- `src/app/[locale]/login/page.jsx` — remove the `import DevPartnerLogin` line and the component usage under the Sign In form.

Example git commands to remove these files/changes:

```bash
# delete the dev login component
git rm src/components/auth/DevPartnerLogin.jsx
git add src/contexts/AuthContext.jsx src/app/[locale]/login/page.jsx
git commit -m "chore: remove dev-only partner impersonation helper"
```

If you edited other files (for example added `process.env.NODE_ENV` guards), remove those guards only if they are not needed otherwise.

---

## How to enable and test the real partner login

1. Ensure your backend has a working authentication endpoint (`/auth/login` or similar) and a profile endpoint (`/auth/profile`) that the frontend expects.

2. Confirm `authService.login` and `authService.getCurrentUser` are implemented correctly and return the data structure expected by `AuthContext.login`.

3. Confirm `src/contexts/AuthContext.jsx`'s `login` function:

   - calls `authService.login({ email, password })` and receives a token,
   - stores the `token` cookie with `path: '/'`,
   - calls `authService.getCurrentUser()` to fetch full profile,
   - maps backend role to `client|admin|partner` and redirects to the appropriate dashboard.

4. Check that middleware (if present) uses the `token` cookie and/or backend session to protect `/<locale>/dashboard/partner`.

5. Run the dev server and test with a real partner account:

```powershell
npm run dev
# then open in browser: http://localhost:3000/en/login
```

Sign in with a real partner account. After login you should be redirected to `/<locale>/dashboard/partner` and cookies should be set under Application → Cookies in DevTools.

---

## Code snippets: safe removal and replacement

To remove the dev impersonation code from `AuthContext.jsx`, delete the devImpersonate function and the export reference. Example (conceptual):

```js
// remove the entire devImpersonate block from AuthContext.jsx
// and also remove devImpersonate from the `value` object that the context provides
```

And delete the component `src/components/auth/DevPartnerLogin.jsx` completely.

In `src/app/[locale]/login/page.jsx` remove the import and the component usage, for example:

```js
// remove this line if present:
// import DevPartnerLogin from '@/components/auth/DevPartnerLogin';

// remove this usage if present under SignInForm:
// <DevPartnerLogin />
```

---

## Checklist before merging to a shared branch

- [ ] Delete `DevPartnerLogin.jsx` (or keep it outside the repo as a local snippet).
- [ ] Remove `devImpersonate` from `AuthContext.jsx` and remove it from the exported `value`.
- [ ] Remove `import DevPartnerLogin` from the login page.
- [ ] Run `npm run build` locally or on CI to ensure no server/client mismatch caused by leftover client-only imports.
- [ ] Search the repo for `devImpersonate`, `DevPartnerLogin`, and `process.env.NODE_ENV` dev guards to ensure nothing dev-only is left accidentally.

Commands:

```bash
# run a quick search (ripgrep recommended)
rg "DevPartnerLogin|devImpersonate|dev quick-login" || true

# run local production build check (optional, can be heavy):
npm run build
```

---

## Troubleshooting

- If login redirects back to `/login` after entering valid credentials:

  - Check that `token` cookie is set and accessible (Application → Cookies). Ensure `path` is `/`.
  - Check server logs and `authService.login` response. Confirm the token is valid and middleware accepts it.

- If middleware still redirects even after a valid token:

  - Confirm server-side middleware reads the same cookie name and path.
  - Confirm cookie `sameSite` and `secure` attributes are compatible with your environment.

- If you forgot to remove the dev code and build fails with `next/dynamic` or other client/server import issues:
  - Remove the dev import from any Server Component and import it only in Client Components or delete it entirely.

---

If you want, I can prepare a minimal PR that deletes the development-only component and the `devImpersonate` export, and run a quick repo search to ensure nothing is left behind. Tell me if you'd like me to create that PR or just generate the deletion patch here.
