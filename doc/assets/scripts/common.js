window.onload = function() {
  const articleMarkdown = document.querySelector('.article_markdown');

  // TOC, Table of Contents
  // TOC 포지션
  const wrapToc = document.querySelector('.wrap_toc');
  function wrapTocPosition() {
    if(wrapToc) {
      var article = document.querySelector('.article_markdown');
      var articlePosition = article.getBoundingClientRect();
      var TOCPostion = articlePosition.x + articlePosition.width + 30;
      wrapToc.style.left = TOCPostion  + 'px';
    }
  }
  wrapTocPosition();
  window.addEventListener("resize", () => {
    wrapTocPosition();
  });
  // TOC 클릭 이벤트
  if(wrapToc) {
    const markdownHeading = articleMarkdown.querySelectorAll('h1, h2, h3');
    const linkToc = wrapToc.querySelectorAll('.item_toc > a');
    for(let i = 0; i < linkToc.length; i++) {
      linkToc[i].addEventListener("click", (e) => {
        e.preventDefault();
        // active 클래스 추가/제거
        linkToc.forEach((elem) => {
          elem.classList.remove('active');
        });
        e.target.classList.add('active');
        // 해당 헤딩태그로 이동
        const targetHref = e.target.getAttribute('href').replace('#', '');
        for(let j = 0; j < markdownHeading.length; j++) {
          if(targetHref === markdownHeading[j].id) {
            const targetOffsetTop = markdownHeading[j].offsetTop;
            window.scroll(0, targetOffsetTop - 10);
          }
        }
      });
    }
  }
}
