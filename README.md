# sbns-backend-api
# sbns-server


# Blog Backend (Express + Mongoose)

Matches the `AddBlog` React form exactly: `title`, `thumbnail`, `categories`,
`tags`, and `content` (EditorJS `{ time, blocks, version }`), plus a
separate inline-image upload endpoint for the EditorJS image tool.

## Install

```bash
npm install express mongoose multer cors dotenv
```

## `.env`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_db
BACKEND_URL=http://localhost:5000/
```

`BACKEND_URL` matches `process.env.REACT_APP_BACKEND_URL` on the frontend —
returned image/thumbnail URLs are prefixed with it.

## Run

```bash
node app.js
```

## Endpoints

| Method | Route                        | Purpose                                              |
|--------|-------------------------------|-------------------------------------------------------|
| POST   | `/api/blogs/upload-image`     | EditorJS image tool upload (field: `image`)           |
| POST   | `/api/blogs`                  | Create blog (multipart: `thumbnail` file + fields)    |
| GET    | `/api/blogs`                  | List blogs (`?page&limit&category&tag&search&status`) |
| GET    | `/api/blogs/:idOrSlug`        | Get one blog by id or slug (increments `views`)       |
| PUT    | `/api/blogs/:id`               | Update blog (thumbnail optional)                       |
| DELETE | `/api/blogs/:id`               | Delete blog (also removes its thumbnail file)          |

### Create/Update body (multipart/form-data)

- `title`: string
- `thumbnail`: file (image)
- `categories`: JSON string, e.g. `'["Technology","Health"]'`
- `tags`: JSON string, e.g. `'["react","nodejs"]'`
- `content`: JSON string of EditorJS's `editorInstance.current.save()` output

### Frontend `handleSubmit` mapping

```js
const fd = new FormData();
fd.append("title", formData.title);
fd.append("thumbnail", thumbnailFile);
fd.append("categories", JSON.stringify(formData.categories));
fd.append("tags", JSON.stringify(formData.tags));
fd.append("content", JSON.stringify(savedData)); // from editorInstance.current.save()

await axios.post(`${BACKEND_URL}/api/blogs`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

## Notes

- Validation mirrors the frontend's own checks (empty title, no thumbnail,
  no category, no tags, empty content blocks) so the API rejects bad data
  even if the client-side checks are bypassed.
- Slugs are auto-generated from `title` and de-duplicated (`my-post`,
  `my-post-1`, `my-post-2`, ...).
- Uploaded files are removed from disk on failed inserts, on thumbnail
  replacement, and on blog delete, so `/uploads` doesn't accumulate orphans.
- `author`/auth is wired to `req.user?._id` — plug in your real auth
  middleware (e.g. matching `FrontendAuthContext`'s token) on the routes
  that should be protected.