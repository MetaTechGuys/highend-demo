export default function Head() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/slide-1.webp"
        imagesrcset="/images/slide-1.webp"
        imagesizes="100vw"
      />
      <link rel="preload" as="video" href="/videos/main.webm" />
    </>
  );
}
