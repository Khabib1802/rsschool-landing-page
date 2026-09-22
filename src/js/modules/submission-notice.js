const STORAGE_KEY = "moss-submission-notice-closed";

const PULL_REQUEST_URL =
  "https://github.com/Khabib1802/rsschool-landing-page/pull/1";

const createSubmissionNotice = () => {
  const notice = document.createElement("aside");

  notice.className = "submission-notice";
  notice.setAttribute("aria-label", "Submission link information");

  notice.innerHTML = `
    <div class="submission-notice__panel">
      <div class="submission-notice__header">
        <p class="submission-notice__eyebrow">SUBMISSION LINK</p>

        <button
          class="submission-notice__close"
          type="button"
          aria-label="Close notification"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <p class="submission-notice__title">
        The submitted link is incorrect.
      </p>

      <p class="submission-notice__text">
        Please use this Pull Request instead:
      </p>

      <a
        class="submission-notice__link"
        href="${PULL_REQUEST_URL}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Pull Request #1
        <span aria-hidden="true">↗</span>
      </a>
    </div>

    <button
      class="submission-notice__tab"
      type="button"
      aria-label="Open submission link notification"
      aria-expanded="false"
    >
      <span class="submission-notice__tab-label">PR #1</span>
    </button>
  `;

  document.body.append(notice);

  const closeButton = notice.querySelector(".submission-notice__close");
  const tab = notice.querySelector(".submission-notice__tab");

  const close = () => {
    notice.classList.add("submission-notice--closed");
    tab.setAttribute("aria-expanded", "false");

    localStorage.setItem(STORAGE_KEY, "true");
  };

  const open = () => {
    notice.classList.remove("submission-notice--closed");
    tab.setAttribute("aria-expanded", "true");
  };

  closeButton.addEventListener("click", close);
  tab.addEventListener("click", open);

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    notice.classList.add("submission-notice--closed");
  }

  return {
    notice,
    close,
    open,
  };
};

export const initSubmissionNotice = () => {
  if (document.querySelector(".submission-notice")) {
    return;
  }

  createSubmissionNotice();
};
