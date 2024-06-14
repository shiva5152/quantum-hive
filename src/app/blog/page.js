"use client";
import MainLayout from "@/components/layout/MainLayout";
import useWow from "@/hooks/useWow";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { useEffect, useState } from "react";

const getPost = async (page, pageSize, searchTerm = "") => {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  // Escape special characters in the search term to prevent GROQ injection
  const escapedSearchTerm = searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  const query = `
    *[_type == "blog" && (
      title match "${escapedSearchTerm}*" ||
      "${escapedSearchTerm}" in tags
    )]{
      title,
      slug,
      description,
      mainImage {
        asset->{
          _id,
          url
        }
      },
      category,
      date,
      tags,
      "totalPosts": count(*[_type == "blog" && (
        title match "${escapedSearchTerm}*" ||
        "${escapedSearchTerm}" in tags
      )])
    }[${start}...${end}]
  `;

  const response = await client.fetch(query);
  console.log(response);
  return response;
};

const Blogpage = () => {
  useWow();
  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);

  const totalPosts = posts[0]?.totalPosts;
  const pageSize = 3;
  const totalPages = Math.ceil(totalPosts / pageSize);

  const setPageNumber = (page) => {
    setPage(page);
  };
  const handleNextPage = () => {
    console.log(page, totalPages);
    if (totalPages > page) setPage((prev) => prev + 1);
  };

  const fetchData = async (value) => {
    const response = await getPost(page, pageSize, value ? value : "");
    setPosts(response);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <MainLayout>
      <div
        className="blog-grid-section scroll-margin pt-120 mb-120"
        id="blog-grid"
      >
        <div className="container">
          <div className="row g-4 mb-50">
            {posts.map((post, index) => (
              <div
                className="col-lg-4 col-md-6 wow animate fadeInDown"
                data-wow-delay={`${(index + 1) * 200}ms`}
                data-wow-duration="1500ms"
              >
                <div className="blog-card style-2">
                  <div className="blog-card-img-wrap">
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="card-img"
                    >
                      <img src="assets/img/home3/blog-img1.jpg" alt="" />
                    </Link>
                    <Link href={`/blog/${post.slug.current}`} className="date">
                      <span>
                        <strong>{new Date(post?.date).getDay()}</strong>{" "}
                        {monthNames[new Date(post?.date).getMonth()]}
                      </span>
                    </Link>
                  </div>
                  <div className="card-content">
                    <div className="blog-meta">
                      <ul className="category">
                        <Link href={`/blog/${post.slug.current}`}>
                          {post.category}
                        </Link>
                      </ul>
                      <div className="blog-comment">
                        <span>Comment (20)</span>
                      </div>
                    </div>
                    <h4>
                      <Link href={`/blog/${post.slug.current}`}>
                        {post.title}
                      </Link>
                    </h4>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="read-more-btn"
                    >
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={10}
                        height={10}
                        viewBox="0 0 10 10"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.48878 0.885308L0 9.37364L0.626356 10L9.11469 1.51122V7.38037H10V0H2.61963V0.885308H8.48878Z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row">
            <div
              className="col-lg-12 d-flex justify-content-center wow animate fadeInUp"
              data-wow-delay="400ms"
              data-wow-duration="1500ms"
            >
              <div className="pagination-area">
                <ul className="paginations">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => setPageNumber(i + 1)}
                      className={`page-item ${page === i + 1 ? "active" : ""}`}
                    >
                      <a>{i + 1}</a>
                    </li>
                  ))}
                  <li
                    onClick={handleNextPage}
                    style={{ cursor: "pointer" }}
                    className="page-item paginations-button"
                  >
                    <a>
                      NXT
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={12}
                        viewBox="0 0 14 12"
                      >
                        <path d="M0.020025 6.33628C0.0901115 6.5271 0.25031 6.73476 0.400496 6.83017C0.550683 6.91997 0.946172 6.92558 5.76715 6.95364L10.9736 6.98171L9.08627 8.77205C7.85974 9.93381 7.16889 10.6297 7.11883 10.7476C6.94862 11.1517 7.10381 11.6961 7.44423 11.8981C7.63947 12.0216 8.01494 12.0328 8.18014 11.9318C8.24022 11.8925 9.53682 10.6803 11.0687 9.23226C12.941 7.45876 13.8722 6.53833 13.9273 6.42047C14.0775 6.05567 13.9923 5.65719 13.697 5.3429C13.2014 4.82656 8.1451 0.140237 8.00993 0.0728886C7.79466 -0.0337464 7.60943 -0.0225217 7.36413 0.100951C6.96864 0.302995 6.79843 0.909129 7.0137 1.31883C7.06376 1.41424 7.96988 2.301 9.02619 3.28316C10.0775 4.27093 10.9436 5.09034 10.9436 5.11279C10.9486 5.14085 8.61068 5.15769 5.74713 5.15769L0.550683 5.15769L0.385478 5.28116C0.135167 5.47759 0.0250308 5.67964 0.00500557 5.98271C-0.00500609 6.12863 -2.49531e-07 6.29139 0.020025 6.33628Z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Blogpage;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
