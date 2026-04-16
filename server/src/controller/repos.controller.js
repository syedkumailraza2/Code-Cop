import User from "../model/user.model.js";
import { decryptToken } from "../utility/crypto.utils.js";

export async function getUserRepos(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = decryptToken(
      user.accessToken,
      user.accessTokenIv,
      user.accessTokenTag
    );

    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    let url = `https://api.github.com/user/repos?per_page=30&page=${page}&sort=updated&type=all`;

    const ghRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!ghRes.ok) {
      const body = await ghRes.text();
      console.error("[Repos] GitHub API error:", ghRes.status, body);
      return res.status(ghRes.status).json({ message: "Failed to fetch repositories" });
    }

    let repos = await ghRes.json();

    if (search) {
      const q = search.toLowerCase();
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.full_name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    const mapped = repos.map((r) => ({
      name: r.name,
      fullName: r.full_name,
      private: r.private,
      description: r.description,
      language: r.language,
      updatedAt: r.updated_at,
      htmlUrl: r.html_url,
      stars: r.stargazers_count,
    }));

    const linkHeader = ghRes.headers.get("link");
    const hasMore = linkHeader ? linkHeader.includes('rel="next"') : false;

    res.json({ repos: mapped, hasMore });
  } catch (error) {
    console.error("[Repos] Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
