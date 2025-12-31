import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const page = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(filteredProductsCount / resPerPage);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // Update page while keeping other query params
  const setCurrentPageNo = (event) => {
    const selectedPage = event.selected + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", selectedPage);
    setSearchParams(params);

    // Optional: scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLastPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageCount);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (filteredProductsCount <= resPerPage) return null;

  return (
    <div className="d-flex justify-content-center align-items-center my-4 gap-2">

      {/* First Page */}
      <button
        className="btn btn-outline-primary"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
      >
        First
      </button>

      {/* Prev / Numbers / Next */}
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={setCurrentPageNo}
        forcePage={currentPage - 1}
        previousLabel="Prev"
        nextLabel="Next"
        breakLabel="..."
        containerClassName="pagination mb-0"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />

      {/* Last Page */}
      <button
        className="btn btn-outline-primary"
        onClick={goToLastPage}
        disabled={currentPage === pageCount}
      >
        Last
      </button>
    </div>
  );
};

export default CustomPagination;
