import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip when the URL carries an anchor, or we override the browser's native
    // jump on a direct load of e.g. /blog/resume-no-experience#step-3 and dump
    // the reader at the top. This effect also runs on initial mount, so it
    // affects shared links and SERP jump-links, not just in-app navigation.
    if (!window.location.hash) {
      window.scrollTo(0, 0); // Scroll to top on route change
    }
    trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
