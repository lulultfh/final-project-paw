import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/error.svg"
        alt="Not Found"
        width={300}
        height={300}
        className="mb-6"
      />
      <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
      <p className="text-gray-600">Halaman yang kamu cari ga ada.</p>
    </div>
  );
}
