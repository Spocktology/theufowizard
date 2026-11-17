// Pages Function middleware — 301 redirect satorufo.com → theufowizard.com/sat-or-ufo
// Only triggers when satorufo.com is added as a custom domain on this project.
// Requests to theufowizard.com pass through unchanged.

export const onRequest: PagesFunction = async (context) => {
  const host = context.request.headers.get('host') || '';
  const satorufoHosts = ['satorufo.com', 'www.satorufo.com'];

  if (satorufoHosts.includes(host)) {
    const url = new URL(context.request.url);
    return Response.redirect(
      `https://www.theufowizard.com/sat-or-ufo`,
      301
    );
  }

  return context.next();
};
