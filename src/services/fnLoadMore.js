// run this function only in useEffect if you want to load more data by scrolling to the bottom of the page
export const fnLoadMore = (hasNextPage, fetchNextPage) => {
  console.log({hasNextPage});
  if (hasNextPage) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("visible");
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(document.querySelector("#bottom"));
    return () => observer.disconnect();
  }
};
