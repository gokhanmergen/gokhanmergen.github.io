(() => {
  const timeline = document.querySelector("[data-timeline]");
  if (!timeline) {
    return;
  }

  const items = Array.from(timeline.querySelectorAll(".timeline-item"));
  const nodes = items.map((item) => item.querySelector(".timeline-node"));
  const panel = timeline.querySelector(".timeline-panel");
  if (!items.length || !panel) {
    return;
  }

  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");
  const defaultIndex = Math.max(0, items.findIndex((item) => item.hasAttribute("data-default")));
  const state = {
    selected: defaultIndex,
    shown: -1,
  };

  const render = (index) => {
    if (index === state.shown) {
      return;
    }
    state.shown = index;
    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle("is-active", active);
      item.classList.toggle("is-reached", i < index);
      nodes[i].setAttribute("aria-expanded", String(active));
      nodes[i].tabIndex = active ? 0 : -1;
    });
    const body = items[index].querySelector(".timeline-item-body");
    panel.className = "timeline-panel " + Array.from(items[index].classList)
      .filter((name) => name.startsWith("timeline-item-"))
      .map((name) => name.replace("timeline-item-", "timeline-panel-"))
      .join(" ");
    panel.innerHTML = body ? body.innerHTML : "";
    panel.classList.remove("is-entering");
    void panel.offsetWidth;
    panel.classList.add("is-entering");
  };

  const select = (index) => {
    state.selected = index;
    render(index);
  };

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => {
      select(index);
    });
    node.addEventListener("focus", () => {
      select(index);
    });
    node.addEventListener("mouseenter", () => {
      if (hoverCapable.matches) {
        render(index);
      }
    });
    node.addEventListener("keydown", (event) => {
      let target = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        target = (index + 1) % nodes.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        target = (index - 1 + nodes.length) % nodes.length;
      } else if (event.key === "Home") {
        target = 0;
      } else if (event.key === "End") {
        target = nodes.length - 1;
      }
      if (target === null) {
        return;
      }
      event.preventDefault();
      nodes[target].focus();
    });
  });

  timeline.querySelector(".timeline-track").addEventListener("mouseleave", () => {
    if (hoverCapable.matches) {
      render(state.selected);
    }
  });

  timeline.classList.add("is-enhanced");
  render(state.selected);
})();
