import { type ImageLoaderProps } from "next/image";
import crypto from "crypto";

const imgproxyEndpoint = process.env.NEXT_PUBLIC_IMGPROXY_ENDPOINT || "https://img.rachatat.com";
const imgproxyBaseUrl = process.env.NEXT_PUBLIC_IMGPROXY_BASE_URL || "http://host.docker.internal:8100";
const imgproxyKey = process.env.IMGPROXY_KEY || "3029c86a5f860b92ba5b68b5d2c026bcc68ef3e302fa6280068cb6138122c4a8d5fdcb3bf3e6ef98d508c21e7b13c9284a0468785dd326897a8fee28f95ec87f";
const imgproxySalt = process.env.IMGPROXY_SALT || "c3758f493f870a0d3a78ab98315c5bfac75697217300b8079ac78749b68e30273eff00373673cd03360758331caf6190cdbabaf2928af73380e6d32346638b6a";

function sign(path: string): string {
  const keyBuffer = Buffer.from(imgproxyKey, "hex");
  const saltBuffer = Buffer.from(imgproxySalt, "hex");

  const hmac = crypto.createHmac("sha256", keyBuffer);
  hmac.update(saltBuffer);
  hmac.update(path);

  return hmac
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildImgproxyPath(src: string, width: number, quality: number): string {
  const fullSrc = new URL(src, imgproxyBaseUrl).toString();
  const escapedSrc = fullSrc
    .replace("%", "%25")
    .replace("?", "%3F")
    .replace("@", "%40");

  const processingOptions = `/width:${width}/quality:${quality}`;
  const encodedUrl = `/plain/${escapedSrc}`;
  const path = `${processingOptions}${encodedUrl}`;

  const signature = sign(path);
  return `${imgproxyEndpoint}/${signature}${path}`;
}

export default ({ src, width, quality }: ImageLoaderProps) => {
  return buildImgproxyPath(src, width ?? 0, quality ?? 75);
};