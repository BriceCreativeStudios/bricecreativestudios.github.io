/* Preserve navigation from the unchanged published policy and old bookmarks. */
function followLegacyPageLink() {
  const pages = { '#games': 'games.html', '#contact': 'contact.html', '#privacy': 'privacy-legal.html' };
  const target = pages[window.location.hash];
  if (target) window.location.replace(target);
}
followLegacyPageLink();
window.addEventListener('hashchange', followLegacyPageLink);
