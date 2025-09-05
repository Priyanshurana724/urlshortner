import { getShortUrl } from "../dao/short_url.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

// ✅ Base URL: fallback to localhost for dev
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  let shortPath;

  if (req.user) {
    shortPath = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortPath = await createShortUrlWithoutUser(data.url);
  }

  // Return full URL (backend domain + slug)
  res.status(200).json({ shortUrl: `${APP_URL}${shortPath}` });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);

  if (!url) throw new Error("Short URL not found");

  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;

  const shortPath = await createShortUrlWithoutUser(url, slug);

  res.status(200).json({ shortUrl: `${APP_URL}${shortPath}` });
});
