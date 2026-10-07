import { Cormorant_Garamond, Inter, Tiro_Devanagari_Sanskrit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/content/site";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const deva = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-deva",
  display: "swap",
});

/* ---------------------------------------------------------------------------
   SEO / social. Replace the title + description before running traffic -
   Meta scrapes these for the ad preview card.
   ------------------------------------------------------------------------ */
export const metadata = {
  // Set NEXT_PUBLIC_SITE_URL once you have a domain, so Meta resolves /og.jpg.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: site.hero.headline + " " + site.hero.headlineAccent + " | " + site.brand.name,
  description: site.hero.subheadline,
  openGraph: {
    title: site.hero.headline + " " + site.hero.headlineAccent,
    description: site.hero.subheadline,
    type: "website",
    siteName: site.brand.name,
    // Drop a 1200x630 image at /public/og.jpg to control the ad preview card.
    images: ["/og.jpg"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F26419",
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${deva.variable}`}>
      <body>
        {children}

        {/* Razorpay Checkout - loaded once, used by the payment step */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        {/* ---- Meta Pixel. Set NEXT_PUBLIC_META_PIXEL_ID in .env.local ---- */}
        {PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}
      </body>
    </html>
  );
}
