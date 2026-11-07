const systems = document.querySelector("[data-systems]");
const tabList = systems.querySelector('[role="tablist"]');
const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
const studies = Array.from(systems.querySelectorAll("[data-study]"));

function selectStudy(index, focus = false) {
  if (tabs[index].getAttribute("aria-selected") === "true") {
    if (focus) tabs[index].focus({ preventScroll: true });
    return;
  }

  // Finish motion in the outgoing panel before hiding it.
  studies.forEach((study) => {
    study.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  });

  tabs.forEach((tab, tabIndex) => {
    const selected = index === tabIndex;
    const study = studies[tabIndex];

    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    study.hidden = !selected;
  });

  if (focus) tabs[index].focus({ preventScroll: true });
  systems.dispatchEvent(new CustomEvent("studychange", {
    detail: { study: studies[index] },
  }));
}

tabs.forEach((tab, index) => {
  const study = studies[index];
  study.setAttribute("role", "tabpanel");
  study.setAttribute("aria-labelledby", tab.id);
  study.tabIndex = 0;

  tab.addEventListener("click", () => selectStudy(index));
  tab.addEventListener("keydown", (event) => {
    const destinations = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };

    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    selectStudy(destinations[event.key], true);
  });
});

tabList.hidden = false;
