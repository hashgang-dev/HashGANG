// /blog/assets/js/blog.js

async function loadBlogs() {
  try {
    const response = await fetch("./blogs.json");
    const blogs = await response.json();

    // latest first
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const blogList = document.getElementById("blog-list");

    if (blogs.length === 0) {
      blogList.innerHTML = `
    <p>No articles published yet.</p>
  `;
    } else {
      blogs.forEach((blog) => {
        const card = document.createElement("a");
        card.href = `./${blog.slug}.html`;
        card.className = "blog-card";

        card.innerHTML = `
        <span class="blog-category">
          ${blog.category}
        </span>

        <h2 class="blog-title">
          ${blog.title}
        </h2>

        <p class="blog-description">
          ${blog.description}
        </p>

        <div class="blog-meta">
          <span>${formatDate(blog.date)}</span>
          <span>•</span>
          <span>${blog.readTime}</span>
        </div>
      `;

        blogList.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Failed to load blogs:", error);
  }
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Date(dateString).toLocaleDateString("en-US", options);
}

loadBlogs();
