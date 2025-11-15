import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 py-6 text-center text-sm text-gray-600">
      <div className="flex justify-center mb-4">
        <Image
          src="/seasoner-mountain-logo.png"
          alt="Seasoners Logo"
          width={40}
          height={40}
          className="h-10 w-auto opacity-85"
        />
      </div>
      <p>© {new Date().getFullYear()} Seasoners — All Rights Reserved.</p>
      <p className="text-xs mt-1 italic">"Helping travelers and hosts connect globally."</p>
      <p className="mt-2">
        <a href="mailto:info@seasoners.eu" className="text-sky-700 hover:underline">info@seasoners.eu</a>
      </p>
    </footer>
  );
}
