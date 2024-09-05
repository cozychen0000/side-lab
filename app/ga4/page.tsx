import { GoogleAnalytics,GoogleTagManager  } from "@next/third-parties/google";
import SendInfo from "./send-info";
function page() {
    
  return (
    <div>
      <h1>GA4</h1>
      <SendInfo/>
      {/* <GoogleAnalytics gaId="G-F28R319MYW" /> */}
    </div>
  );
}

export default page;
