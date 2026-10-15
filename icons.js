'use strict';
function icon(name){
 const paths={
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  products:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
  stock:'<path d="m3 9 9-6 9 6v12H3V9Z"/><path d="M8 21v-9h8v9M8 16h8"/>',
  orders:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 7h6M9 11h6M9 15h3"/>',
  history:'<path d="M3 11a9 9 0 1 1 2.6 7.3M3 4v7h7M12 7v5l3 2"/>',
  catalog:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1ZM12 5v15"/>',
  guide:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  alert:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  published:'<path d="m5 12 4 4L19 6"/>',
  inbound:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  outbound:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
 };
 return `<svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.guide}</svg>`;
}
