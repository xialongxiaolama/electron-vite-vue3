"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (parent && child) {
      parent.appendChild(child);
    }
  },
  remove(node) {
    var _a;
    if (node) {
      (_a = node.parentNode) == null ? void 0 : _a.removeChild(node);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(oStyle);
      safeDOM.remove(oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlwY1JlbmRlcmVyICwgY29udGV4dEJyaWRnZSB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5cclxuLy8g6YCa6L+H6aKE5Yqg6L296ISa5pysIOWQkea4suafk+i/m+eoi+S4reaatOmcsuS4u+e6v+eoi+S4reeahOaWueazlVxyXG4vLyB3ZWJQcmVmZXJlbmNlcyDkuK0gY29udGV4dElzb2xhdGlvbiDpu5jorqTkuLp0cnVlIOmalOemu+S6hlxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdpcGNSZW5kZXJlcicse1xyXG4gIG9uKC4uLmFyZ3M6UGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIub24+KXtcclxuICAgIC8vIGNoYW5uZWw6IHN0cmluZywgbGlzdGVuZXI6IChldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgLi4uYXJnczogYW55W10pID0+IHZvaWRcclxuICAgIGNvbnN0IFtjaGFubmVsLCBsaXN0ZW5lcl0gPSBhcmdzXHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKGV2ZW50LCAuLi5hcmdzKSA9PiBsaXN0ZW5lcihldmVudCwgLi4uYXJncykpXHJcbiAgfSxcclxuICBvZmYoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIub2ZmPikge1xyXG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJnc1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLm9mZihjaGFubmVsLCAuLi5vbWl0KVxyXG4gIH0sXHJcbiAgc2VuZCguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBpcGNSZW5kZXJlci5zZW5kPikge1xyXG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJnc1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4ub21pdClcclxuICB9LFxyXG4gIGludm9rZSguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBpcGNSZW5kZXJlci5pbnZva2U+KSB7XHJcbiAgICBjb25zdCBbY2hhbm5lbCwgLi4ub21pdF0gPSBhcmdzXHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKGNoYW5uZWwsIC4uLm9taXQpXHJcbiAgfSxcclxufSlcclxuXHJcbi8vIOa3u+WKoOWKoOi9veetieW+heWKqOeUu1xyXG5mdW5jdGlvbiBkb21SZWFkeShjb25kaXRpb246RG9jdW1lbnRSZWFkeVN0YXRlW10gPSBbJ2NvbXBsZXRlJywnaW50ZXJhY3RpdmUnXSl7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuICAgIGlmIChjb25kaXRpb24uaW5jbHVkZXMoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcclxuICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsICgpID0+IHtcclxuICAgICAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XHJcbiAgICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmNvbnN0IHNhZmVET00gPSB7XHJcbiAgYXBwZW5kKHBhcmVudDpIVE1MRWxlbWVudCwgY2hpbGQ6SFRNTEVsZW1lbnQpIHtcclxuICAgIGlmIChwYXJlbnQgJiYgY2hpbGQpIHtcclxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVtb3ZlKG5vZGU6SFRNTEVsZW1lbnQpIHtcclxuICAgIGlmIChub2RlKSB7XHJcbiAgICAgIG5vZGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQobm9kZSlcclxuICAgIH1cclxuICB9LFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXNlTG9hZGluZygpIHtcclxuICBjb25zdCBjbGFzc05hbWUgPSBgbG9hZGVycy1jc3NfX3NxdWFyZS1zcGluYFxyXG4gIGNvbnN0IHN0eWxlQ29udGVudCA9IGBcclxuQGtleWZyYW1lcyBzcXVhcmUtc3BpbiB7XHJcbiAgMjUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMCk7IH1cclxuICA1MCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpOyB9XHJcbiAgNzUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyk7IH1cclxuICAxMDAlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDApOyB9XHJcbn1cclxuLiR7Y2xhc3NOYW1lfSA+IGRpdiB7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuICB3aWR0aDogNTBweDtcclxuICBoZWlnaHQ6IDUwcHg7XHJcbiAgYmFja2dyb3VuZDogI2ZmZjtcclxuICBhbmltYXRpb246IHNxdWFyZS1zcGluIDNzIDBzIGN1YmljLWJlemllcigwLjA5LCAwLjU3LCAwLjQ5LCAwLjkpIGluZmluaXRlO1xyXG59XHJcbi5hcHAtbG9hZGluZy13cmFwIHtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgdG9wOiAwO1xyXG4gIGxlZnQ6IDA7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJhY2tncm91bmQ6IGJsYWNrO1xyXG4gIHotaW5kZXg6IDk7XHJcbn1cclxuICAgIGBcclxuICBjb25zdCBvU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgY29uc3Qgb0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gIG9TdHlsZS5pZCA9ICdhcHAtbG9hZGluZy1zdHlsZSdcclxuICBvU3R5bGUuaW5uZXJIVE1MID0gc3R5bGVDb250ZW50XHJcbiAgb0Rpdi5jbGFzc05hbWUgPSAnYXBwLWxvYWRpbmctd3JhcCdcclxuICBvRGl2LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+PGRpdj48L2Rpdj48L2Rpdj5gXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBhcHBlbmRMb2FkaW5nKCkge1xyXG4gICAgICBzYWZlRE9NLmFwcGVuZChkb2N1bWVudC5oZWFkLCBvU3R5bGUpXHJcbiAgICAgIHNhZmVET00uYXBwZW5kKGRvY3VtZW50LmJvZHksIG9EaXYpXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlTG9hZGluZygpIHtcclxuICAgICAgc2FmZURPTS5yZW1vdmUob1N0eWxlKVxyXG4gICAgICBzYWZlRE9NLnJlbW92ZShvRGl2KVxyXG4gICAgfSxcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHsgYXBwZW5kTG9hZGluZyAsIHJlbW92ZUxvYWRpbmcgfSA9IHVzZUxvYWRpbmcoKVxyXG5kb21SZWFkeSgpLnRoZW4oYXBwZW5kTG9hZGluZylcclxuXHJcbndpbmRvdy5vbm1lc3NhZ2UgPSAoZXYpID0+IHtcclxuICBldi5kYXRhLnBheWxvYWQgPT09ICdyZW1vdmVMb2FkaW5nJyAmJiByZW1vdmVMb2FkaW5nKClcclxufVxyXG5cclxuc2V0VGltZW91dChyZW1vdmVMb2FkaW5nLCA0OTk5KSJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOztBQUlBQSxTQUFBQSxjQUFjLGtCQUFrQixlQUFjO0FBQUEsRUFDNUMsTUFBTSxNQUF1QztBQUVyQyxVQUFBLENBQUMs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
